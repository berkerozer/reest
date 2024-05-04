import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export const returnType = (parameter: any) => {
  if (parameter === undefined) {
    return "undefined";
  }

  if (parameter.name === "String") {
    return "string";
  } else if (parameter.name === "Number") {
    return "number";
  } else if (parameter.name === "Boolean") {
    return "boolean";
  } else {
    const schemas = validationMetadatasToSchemas();
    return {
      ...schemas[parameter.name],
      name: parameter.name,
    };
  }
};
