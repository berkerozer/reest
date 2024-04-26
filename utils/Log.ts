import chalk from "chalk";
import moment from "moment";

type LogType = "INFO" | "ERROR" | "WARN" | "SUCCESS";

export const Log = (message: string, type?: LogType): void => {
  console.log(
    chalk.white(`[reest][LOG][${moment().format("hh:mm:ss")}] ${message}`)
  );
};
