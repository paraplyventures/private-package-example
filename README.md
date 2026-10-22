# Publish and install your first private npm package

A tiny JavaScript package, a separate recipient project, and no build dependencies.
Follow the [PrivateNPM quickstart](https://privatenpm.com/guides/quickstart) for the complete publish and install procedure, including expected output and authentication troubleshooting.

## Check the package locally

Use Node.js 24 and pnpm 12.5.1. From this directory:

```sh
pnpm verify
```

The check packs the actual publisher files, installs that tarball offline in a fresh project and store, and prints `Hello from my private package!`. It does not publish, contact a registry, use credentials or prove a hosted CI release.

## Publish to your own scope

1. Reserve a scope under **Registry → Registries** in PrivateNPM. Use the shared registry to start without DNS.
2. Configure the files with your actual scope:

   ```sh
   node configure.mjs @your-scope
   ```

   For an active custom domain, add its HTTPS origin as the second argument. This writes configuration and a variable reference, never a secret. The checked-in `.invalid` destination prevents accidental publishing before configuration.
3. Create a publisher key restricted to that scope, with **Publish** and **Read metadata**. Store the key in `ACME_NPM_TOKEN` through your secret store.
4. From `publisher/`, inspect the package and publish. For pnpm 12, pass its host-scoped credential setting (replace the host if you use a custom domain):

   ```sh
   pnpm pack
   env "pnpm_config_//registry.privatenpm.com/:_authToken=$ACME_NPM_TOKEN" pnpm publish --no-git-checks
   ```

   For npm, follow the linked quickstart. pnpm 12 does not expand authentication variables in project `.npmrc` files. The scope route remains useful for both clients.
5. Create a separate **download key** granting this exact package. Replace `ACME_NPM_TOKEN` with the download key in your shell environment.
6. From `consumer/`, install the published version and run the consumer (replace `@your-scope`):

   ```sh
   env "pnpm_config_//registry.privatenpm.com/:_authToken=$ACME_NPM_TOKEN" \
     pnpm add @your-scope/hello-private@1.0.0 --ignore-scripts --store-dir ./empty-store
   pnpm start
   ```

If your package manager enforces a minimum release age, keep the policy and install after that waiting period. An offline tarball check is not evidence that a fresh registry version passes that policy. Never commit keys, put them in URLs, or reuse publisher credentials for recipients.

## Continue

- [Fix npm E401 authentication errors](https://privatenpm.com/guides/npm-e401-unauthorized)
- [Configure npm, pnpm, Yarn and CI](https://privatenpm.com/guides/npmrc-private-registry)
- [Publish from GitHub Actions or GitLab CI with OIDC](https://privatenpm.com/guides/npm-trusted-publishing)
- [Give recipients control of their download keys](https://privatenpm.com/guides/recipient-download-portal)

MIT licensed. The hosted registry is a separate service with its own trial and plans.
