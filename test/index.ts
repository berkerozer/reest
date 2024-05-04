import { App, Controllers, PORT, Openapi, UseGlobalInterceptor } from "reest";
import { CatsController } from "./controllers/cats.controller";
import {
  TimeTrackingInterceptor,
  TestInterceptor,
} from "./middlewares/TimeTrackingInterceptor";

@PORT(8080)
@Openapi("/docs", {
  info: {
    title: "Cats API REST",
  },
})
@Controllers(CatsController)
@UseGlobalInterceptor(TimeTrackingInterceptor)
@UseGlobalInterceptor(TestInterceptor)
// @UseGlobalMiddleware(LoggerMiddleware, {
//   forRoutes: [{
//     path: "/cats",
//     method: "GET",
//   }],
// })
// @UseGlobalPipe(ValidationPipe)
// @UseGlobalGuard(AuthGuard)
class MyRestApi extends App {}

new MyRestApi();
