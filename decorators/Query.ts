import { QueryOptions } from "../types/QueryOptions";
import { returnType } from "../utils/ReturnType";

export function Query(paramName?: string, options?: QueryOptions) {
  return function (
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number
  ) {
    const parameter = Reflect.getMetadata(
      "design:paramtypes",
      target,
      propertyKey
    )[parameterIndex];

    const metadataKey = `__queryParameters__${String(propertyKey)}`;
    const existingParameters =
      Reflect.getOwnMetadata(metadataKey, target, propertyKey) || [];
    const parameterType: any = returnType(parameter);

    if (parameterType.type === "object") {
      Object.keys(parameterType.properties).forEach((key) => {
        const paramInfo = {
          isObject: true,
          type: "query",
          paramName: key,
          parameterIndex,
          options: {
            required: parameterType.required.includes(key),
            schema: {
              type: parameterType.properties[key].type,
            },
          },
        };

        existingParameters.push(paramInfo);
        Reflect.defineMetadata(
          metadataKey,
          existingParameters,
          target,
          propertyKey
        );
      });

      return;
    }

    const paramInfo = {
      type: "query",
      paramName,
      parameterIndex,
      options: {
        ...options,
        schema: {
          ...options?.schema,
          type: returnType(parameter),
        },
      },
    };

    existingParameters.push(paramInfo);
    Reflect.defineMetadata(
      metadataKey,
      existingParameters,
      target,
      propertyKey
    );
  };
}
