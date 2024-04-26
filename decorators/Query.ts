export function Query(paramName?: string) {
  return function (
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number
  ) {
    const metadataKey = `__queryParameters__${String(propertyKey)}`;
    const existingParameters =
      Reflect.getOwnMetadata(metadataKey, target, propertyKey) || [];
    const paramInfo = { type: "query", paramName, parameterIndex };

    existingParameters.push(paramInfo);
    Reflect.defineMetadata(
      metadataKey,
      existingParameters,
      target,
      propertyKey
    );
  };
}
