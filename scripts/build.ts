import { buildNpmLib, errorCheckSources, shell$, typeCheckSources } from '@maranomynet/libtools';

await shell$(`bun test`);
// errorCheckSources();
await typeCheckSources(); // while eslint is not installed
await buildNpmLib();
