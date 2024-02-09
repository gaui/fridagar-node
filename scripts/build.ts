import { buildNpmLib, errorCheckSources, shell$ } from '@maranomynet/libtools';

await shell$(`bun test`);
await buildNpmLib();
