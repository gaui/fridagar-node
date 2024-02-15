import {
  buildNpmLib,
  errorCheckSources,
  shell$,
  typeCheckSources,
} from "@maranomynet/libtools";

for (let tz of [
  "Asia/Yangon", // +06:30
  "Pacific/Midway", // -11:00
]) {
  await shell$(`TZ=${tz}  bun test`);
}
// errorCheckSources();
await typeCheckSources(); // while eslint is not installed
await buildNpmLib();
