import {
  Body,
  Controller,
  Delete,
  Get,
  File,
  Multer,
  Param,
  Patch,
  Post,
  Put,
  Query,
  IsFile,
  Route,
  Middleware,
} from "reest";
import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsArray,
} from "class-validator";
import { Type } from "class-transformer";
import { FirstMiddleware } from "../middlewares/FirstMiddleware";

class QueryDto {
  @IsString()
  name: string;
  @IsNumber()
  @IsOptional()
  age: number;
}

class Reporter {
  @IsString()
  name: string;
  @IsArray()
  @IsNumber({}, { each: true })
  age: number[];
}

class Coordinates {
  @IsString()
  x: string;
  @IsNumber()
  @IsOptional()
  y: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Reporter)
  reporters: Reporter[];

  @IsFile({ mime: ["image/jpg", "image/png", "image/jpeg"] })
  testFile: File;
}

@Middleware(FirstMiddleware)
@Route("/cats")
export class CatsController extends Controller {
  @Get("/")
  findAll() {
    return "This action returns all users";
  }

  @Middleware(FirstMiddleware)
  @Middleware(FirstMiddleware)
  @Get("/:id")
  findOne(@Param("id") id: string, @Query() q: QueryDto) {
    console.log(q.age, q.name);
    return `This action returns a user with id ${id}`;
  }

  @Post("/")
  @Multer("testFile")
  posta(@Body() body: Coordinates) {
    console.log(body);
    return `This action returns a user with id ${body.x} ${body.y}`;
  }

  @Post("/x")
  @Multer("testFile2", { single: true })
  posta2(@Body() body: Reporter) {
    console.log(body);
    return `This action returns a user with id`;
  }

  @Put("/")
  create() {
    return "This action adds a new user";
  }

  @Patch("/:id")
  update(@Param("id") id: number) {
    return `This action updates a user with id ${id}`;
  }

  @Delete("/:id")
  remove(@Param("id") id: string) {
    return `This action removes a user with id ${id}`;
  }
}
