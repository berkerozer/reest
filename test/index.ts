import { App, Controllers, Swagger } from "reest";
import { UserController } from "./controllers/cats.controller";

@Swagger("/docs")
@Controllers(UserController)
class MyApp extends App {}

new MyApp();
