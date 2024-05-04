import { ParameterOptions } from "../types/ParameterOptions";
import { returnType } from "../utils/ReturnType";

export function Param(paramName?: string, options?: ParameterOptions) {
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

    const metadataKey = `__routeParameters__${String(propertyKey)}`;

    const existingParameters =
      Reflect.getOwnMetadata(metadataKey, target, propertyKey) || [];

    existingParameters.push({
      paramName,
      parameterIndex,
      type: "param",
      options: {
        ...options,
        schema: {
          ...options?.schema,
          type: returnType(parameter),
        },
      },
    });
    Reflect.defineMetadata(
      metadataKey,
      existingParameters,
      target,
      propertyKey
    );
  };
}
