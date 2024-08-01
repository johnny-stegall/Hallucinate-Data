import { strict as assert } from "assert";
import { app } from "@azure/functions";
import { DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import validateRequest from "../shared/ValidateRequest.js";
import VisualizationFactory from "../shared/VisualizationFactory.js";

/******************************************************************************
* Draws a visualization.
******************************************************************************/
app.http("draw-visualization",
{
	methods: ["POST"],
	authLevel: "anonymous",
	route: "draw-{visualization}",
	handler: async (request, context) =>
	{
		context.log(`Http function processed request for url: ${request.url}.`);

		let iVisualization;
		let jsonSchema;
		let body;

		try
		{
			iVisualization = VisualizationFactory.getVisualization(request.params.visualization);
			jsonSchema = await loadSchema(iVisualization.schemaFile);
			body = await request.json();	
		}
		catch (error)
		{
			return { status: 500, body: error.message };
		}

		try
		{
			validateRequest(jsonSchema, body);
		}
		catch (error)
		{
			return { status: 400, body: error.message };
		}

		const svg = iVisualization.draw(body.data, body.visualization);
		return {
			status: 200,
			body: svg
		};
	}
});

/******************************************************************************
* Loads the JSON schema.
*
* @param {string} schemaFile The name of the JSON schema file.
* @returns {object} The JSON schema.
******************************************************************************/
async function loadSchema(schemaFile)
{
	assert(process.env.SchemaContainer != "", "The schema container is required.");
	assert(process.env.SchemaStorageAccount != "", "The storage account name is required.");

	const azureCredential = process.env.ManagedIdentityClientId != ""
		? new DefaultAzureCredential({ managedIdentityClientId: process.env.ManagedIdentityClientId })
		: process.env.SchemaStorageKey != ""
			? new StorageSharedKeyCredential(process.env.SchemaStorageAccount, process.env.SchemaStorageKey)
			: new DefaultAzureCredential();
	const storageAccount = new BlobServiceClient(new URL(`https://${process.env.SchemaStorageAccount}.blob.core.windows.net`), azureCredential);
	const container = storageAccount.getContainerClient(process.env.SchemaContainer);
	const blob = container.getBlobClient(schemaFile);
	const jsonSchema = (await blob.downloadToBuffer()).toString();
	return JSON.parse(jsonSchema);
}