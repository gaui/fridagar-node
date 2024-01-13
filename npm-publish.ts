import { version } from "./package.json";
import { execSync } from "node:child_process";

const dist = "_npm-lib";

try {
  execSync(
    [
      `cd ${dist}`,
      `npm publish`,
      `cd ..`,
      `git add ./package.json ./CHANGELOG.md`,
      `git commit -m "release: v${version}"`,
    ].join(" && ")
  );
} catch (err) {
  console.info('--------------------------');
  const { message, output } = err as {
    message?: string;
    output?: Array<Buffer>;
  };
  console.error(output ? output.join('\n').trim() : message || err);
  console.trace(err); // eslint-disable-line no-console
  process.exit(1);
}
