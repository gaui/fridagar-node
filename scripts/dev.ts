import { shell$, typeCheckSources } from '@maranomynet/libtools';


await shell$(`bun install`);
shell$(`bun test --watch`);
typeCheckSources({ watch: true });
