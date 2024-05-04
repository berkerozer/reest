import {
  IsNumber,
  IsString,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";

interface IsFileOptions {
  mime: ("image/jpg" | "image/png" | "image/jpeg")[];
}

export function IsFile(
  options: IsFileOptions,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    return registerDecorator({
      name: "isFile",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (
            value?.mimetype &&
            (options?.mime ?? []).includes(value?.mimetype)
          ) {
            return true;
          }
          return false;
        },
      },
    });
  };
}

export class File {
  @IsString()
  fieldname: string;
  @IsString()
  originalname: string;
  @IsString()
  encoding: string;
  @IsString()
  mimetype: string;
  @IsString()
  buffer: Buffer;
  @IsNumber()
  size: number;
}
