import test from "ava";
import validateRequest from "../source/Shared/ValidateRequest.js";

const SCHEMA =
{
	type: "object",
	properties:
	{
		visualization:
		{
			type: "object",
			properties:
			{
				height: { type: "number" },
				labelProperty: { type: "string" },
				marginBottom: { type: "number" },
				marginLeft: { type: "number" },
				marginRight: { type: "number" },
				marginTop: { type: "number" },
				valueProperty: { type: "string" },
				width: { type: "number" }
			},
			required: ["height", "labelProperty", "valueProperty", "width"]
		},
		data:
		{
			type: "array",
			items: { type: "object" }
		}			
	},
	required: ["visualization", "data"]
};

test("validateRequest() validates JSON data against a JSON schema", t =>
{
	// Arrange
	const request =
	{
		"visualization":
		{
			"height": 1000,
			"labelProperty": "key",
			"valueProperty": "value",
			"width": 1000
		},
		"data":
		[
			{ "key": "Zero", "value": 0 },
			{ "key": "Twenty-Five", "value": 25 },
			{ "key": "Fifty", "value": 50 },
			{ "key": "Seventy-Five", "value": 75 },
			{ "key": "One-Hundred", "value": 100 }
		]
	}

	// Act
	const isValid = validateRequest(SCHEMA, request);

	// Assert
	t.true(isValid);
});

test("validateRequest() throws errors by default", t =>
{
	// Arrange
	const request =
	{
		"visualization":
		{
			"height": 1000,
			"width": 1000
		},
		"data":
		[
			{ "key": "Zero", "value": 0 },
			{ "key": "Twenty-Five", "value": 25 },
			{ "key": "Fifty", "value": 50 },
			{ "key": "Seventy-Five", "value": 75 },
			{ "key": "One-Hundred", "value": 100 }
		]
	}

	// Act & Assert
	t.throws(() => validateRequest(SCHEMA, request), { instanceOf: TypeError });
});

test("validateRequest() returns false when throwIfInvalid is false", t =>
{
	// Arrange
	const request =
	{
		"visualization":
		{
			"height": 1000,
			"width": 1000
		},
		"data":
		[
			{ "key": "Zero", "value": 0 },
			{ "key": "Twenty-Five", "value": 25 },
			{ "key": "Fifty", "value": 50 },
			{ "key": "Seventy-Five", "value": 75 },
			{ "key": "One-Hundred", "value": 100 }
		]
	}

	// Act
	const isValid = validateRequest(SCHEMA, request, false);

	// Assert
	t.false(isValid);
});