import { readFileSync, writeFileSync } from 'node:fs';

const [scope, rawOrigin = 'https://registry.privatenpm.com/'] = process.argv.slice(2);
if (!/^@[a-z0-9][a-z0-9._~-]{0,213}$/.test(scope ?? '')) {
  throw new Error('Pass your reserved scope, for example: node configure.mjs @acme');
}
const origin = new URL(rawOrigin);
if (origin.protocol !== 'https:' || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash) {
  throw new Error('The registry must be an HTTPS origin without credentials, a path, query or fragment.');
}
const manifestPath = new URL('publisher/package.json', import.meta.url);
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const previous = manifest.name;
manifest.name = `${scope}/hello-private`;
manifest.publishConfig.registry = origin.href;
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
const consumerPath = new URL('consumer/index.mjs', import.meta.url);
writeFileSync(consumerPath, readFileSync(consumerPath, 'utf8').replace(previous, manifest.name));
for (const folder of ['publisher', 'consumer']) {
  writeFileSync(new URL(`${folder}/.npmrc`, import.meta.url), `${scope}:registry=${origin.href}\n//${origin.host}/:_authToken=\${ACME_NPM_TOKEN}\n`);
}
console.log(`Configured ${manifest.name} for ${origin.origin}. No key was read or written.`);
