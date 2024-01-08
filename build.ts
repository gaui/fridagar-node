import pkg from "./package.json";
import { execSync } from "node:child_process";

/** Generates a clean packge.json file for the npm package. */
const makePackageJson = async (
  outDir: string,
  extraFields?: Record<string, unknown>
) => {
  const libPkg = Object.fromEntries(
    Object.entries({
      ...pkg,
      ...pkg.dist_package_json,
      ...extraFields,
      dist_package_json: null,
    }).filter(([, value]) => value != null)
  );
  await Bun.write(`${outDir}/package.json`, JSON.stringify(libPkg, null, "\t"));
};

// ---------------------------------------------------------------------------

const dist = "_npm-lib";

execSync(`rm -rf ${dist}`);
execSync(`bun x tsc --project tsconfig.build.json --module commonjs --outDir ${dist}`);
execSync(`bun x tsc --project tsconfig.build.json --module esnext --outDir ${dist}/esm`);
execSync(`cp README.md CHANGELOG.md ${dist}`);
Promise.all([
  makePackageJson(dist),
  Bun.write(`${dist}/esm/package.json`, JSON.stringify({ type: "module" })),
]);
