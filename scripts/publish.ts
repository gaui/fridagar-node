import { publishToNpm, updatePkgVersion } from '@maranomynet/libtools';

await updatePkgVersion();
await import('./build.js');
await publishToNpm();
