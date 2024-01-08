import { version } from "./package.json";
import { execSync } from "node:child_process";

const dist = "_npm-lib";

try {
  execSync(
    [
      `cd v${dist}`,
      `npm publish`,
      `cd ..`,
      `git add ./package.json ./CHANGELOG.md`,
      `git commit -m "release: v${version}"`,
    ].join(" && ")
  );
} catch (err) {
  console.info("--------------------------");
  const { message, output } = err as {
    message?: string;
    output?: Array<Buffer>;
  };
  console.info(output ? output.join("\n").trim() : message || err);
  process.exit(1);
}
