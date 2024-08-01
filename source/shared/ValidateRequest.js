import Ajv from "ajv";

const jsonSchemaValidator = new Ajv({ allErrors: true });

/******************************************************************************
* Validates the request against the schema.
*
* @param {object} schema The JSON schema.
* @param {*} request The request.
* @param {boolean} [throwIfInvalid=true] If true and the request is invalid, an
* error is thrown, otherwise the function returns false.
* @returns {boolean} True if the request is valid, otherwise false if
* throwIfInvalid is false.
* @throws {TypeError} If the request is invalid and throwIfInvalid is true.
******************************************************************************/
export default function validateRequest(schema, request, throwIfInvalid = true)
{
	const isValid = jsonSchemaValidator.validate(schema, request)

	if (!isValid)
	{
		if (throwIfInvalid)
			throw new TypeError("JSON is invalid: " + JSON.stringify(jsonSchemaValidator.errors));
		else
			return false;
	}
	
	return true;
};