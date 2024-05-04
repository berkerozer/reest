import { returnType } from "../utils/ReturnType";

export function Body() {
  return function (
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number
  ) {
    const type = Reflect.getMetadata("design:paramtypes", target, propertyKey)[
      parameterIndex
    ];

    const parameterType: any = returnType(type) || { type: "object" };

    if (parameterType.type !== "object") {
      throw new Error("Body parameter must be an object");
    }

    const metadataKey = `__bodyParameter__${String(propertyKey)}`;
    const existingParameters =
      Reflect.getOwnMetadata(metadataKey, target, propertyKey) || [];
    const paramInfo = {
      type: "body",
      paramName: "body",
      parameterIndex,
      options: { type: parameterType },
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
