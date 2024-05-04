import { Interceptor } from "reest";
import moment from "moment";

export class TimeTrackingInterceptor implements Interceptor {
  data: {
    start: number;
    end: number;
  } = {
    start: 0,
    end: 0,
  };
  intercept(): void {
    console.log("TimeTrackingInterceptor");
    this.data.start = moment().valueOf();
  }
  complete(): void {
    this.data.end = moment().valueOf();
    console.log(
      "TimeTrackingInterceptor",
      this.data.end - this.data.start + "ms"
    );
  }
}

export class TestInterceptor implements Interceptor {
  data: {
    start: number;
    end: number;
  } = {
    start: 0,
    end: 0,
  };
  intercept(): void {
    console.log("TestInterceptor");
    this.data.start = moment().valueOf();
  }
  complete(): void {
    this.data.end = moment().valueOf();
    console.log("Test", this.data.end - this.data.start + "ms");
  }
}
