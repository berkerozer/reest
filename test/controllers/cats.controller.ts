import { Controller, Delete, Get, Param, Patch, Put } from "reest";

@Controller("/cats")
export class UserController {
  @Get("/")
  findAll() {
    return "This action returns all users";
  }

  @Get("/:id")
  findOne(@Param("id") id: string) {
    return `This action returns a user with id ${id}`;
  }

  @Put("/")
  create() {
    return "This action adds a new user";
  }

  @Patch("/:id")
  update(@Param("id") id: string) {
    return `This action updates a user with id ${id}`;
  }

  @Delete("/:id")
  remove(@Param("id") id: string) {
    return `This action removes a user with id ${id}`;
  }
}
