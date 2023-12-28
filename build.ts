import { execSync } from "child_process";
import pkg from "./package.json";

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

const tscBuild = async (module: string, outdir: string) =>
  execSync(
    `bun x tsc --project tsconfig.build.json --outDir ${outdir} --module ${module}`
  );

// ---------------------------------------------------------------------------

const dist = "_npm-lib";

execSync(
  [
    `rm -rf ${dist}`,
    `mkdir ${dist} ${dist}/esm`,
    `cp README.md CHANGELOG.md ${dist}`,
  ].join(" && ")
);
Promise.all([
  tscBuild("commonjs", dist),
  tscBuild("esnext", `${dist}/esm`),
  makePackageJson(dist),
  Bun.write(`${dist}/esm/package.json`, JSON.stringify({ type: "module" })),
]);
