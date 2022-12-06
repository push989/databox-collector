import { CronJob } from "cron";
import { DataSource } from "../services/collector/CollectorModels";
import IntegratorService from "../services/IntegratorService";

export default function startProcessors() {
  new CronJob(
    "* * * * *",
    () =>
      IntegratorService.integrate([
        {
          dataSource: DataSource.Reddit,
        },
        {
          dataSource: DataSource.StackOverflow,
        },
      ]),
    null,
    true
  );
}
