# Harness Next Gen UI

### Getting Started

```
$ yarn
$ yarn dev
```

This will start the local server in watch mode with hot reloading.

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

### Utilities

Run lint checks

```
$ yarn lint
```

Run unit tests

```
$ yarn test
```
