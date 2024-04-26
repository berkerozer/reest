export function Body(type?: any) {
  return function (
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number
  ) {
    const metadataKey = `__bodyParameter__${String(propertyKey)}`;
    const existingParameters =
      Reflect.getOwnMetadata(metadataKey, target, propertyKey) || [];
    const paramInfo = {
      type: "body",
      paramName: "body",
      parameterIndex,
      options: { type },
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
