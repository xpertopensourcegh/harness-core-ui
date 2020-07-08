# Harness Next Gen UI

### Getting Started

1. Install **NodeJS v13.8**. There are many ways to do this (**choose any one**):
   - Download relevant package from https://nodejs.org/download/release/v13.8.0/, unpack and install.
   - Use Homebrew: `brew install node@13.8`
   - If you already have Node installed, use `nvm` or `n` to install/select correct version. (see https://www.npmjs.com/package/n)

2. Install **yarn** package manager
```
$ brew install yarn
```
> Note: More options here: https://classic.yarnpkg.com/en/docs/install

3. Clone this repo
```
$ git clone git@github.com:wings-software/nextgenui.git
$ cd nextgenui
```

4. Install/Update/Refresh dependencies
```
$ yarn
```
> Note: This will take some time the first time you run it. Subsequent runs should be near-instant. Run this everytime you change branches or take a pull. If there are no dependency changes, this is practically a no-op.

> Note: This is a shorthand for the command `yarn install`. Read more here: https://classic.yarnpkg.com/en/docs/usage

5. Compile/Build the code **and** start the web-server in watch mode
```
$ yarn dev
```
> Note: This will start the local server in watch mode with hot reloading. Any code changes will trigger fast patch rebuilds and refresh the page in the browser.

For login, you need to run `wingsui` repo first. Once logged in, come back here and everything should work.

<details>
  <summary>Details</summary>
  Login and credential management is not implemented in `nextgenui` yet. When you login in `wingsui`, your auth tokens are set against `localhost:8181`, which can be read by this server since it is running on the same port.
  
  You can also use `nginx` on your machine to run both `wingsui` and `nextgenui` simultaneously if needed.
</details>

### Publishing

```
$ yarn build
$ yarn docker <tagname>
```

First command will create a production build (minified, optimised).

Second command will create a docker image and _publish_ it to `harness/nextgenui` Dockerhub repo.

### Configuring Proxies (optional)

You can configure/manage proxies for local development in the file `webpack.config.js`. Sample:
```
proxy: {
   '/cd/api': {
     logLevel: 'info',
     target: 'http://localhost:7457',
     pathRewrite: { '^/cd/api': '' }
  }
},
```
> Note: These proxies are only relevant for local development. This config file is used by `webpack-dev-server` package, which we use to serve files locally. This is **not** used in the docker builds. 

> The docker builds all use `nginx` to serve the built files, whose configuration is stored at `scripts/nginx.conf`. This config is shared for prod builds, so please pay attention if making changes.

### Auto-generating services

See [src/services/README.md](https://github.com/wings-software/nextgenui/blob/master/src/services/README.md)

### Utilities

Run lint checks

```
$ yarn lint
```

Run unit tests

```
$ yarn test
```
