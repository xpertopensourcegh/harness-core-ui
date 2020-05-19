# Harness Next Gen UI

### Getting Started

```
$ yarn
$ yarn dev
```

This will start the local server in watch mode with hot reloading.

### Publishing

```
$ yarn build
$ yarn docker <tagname>
```

First command will create a production build (minified, optimised).
Second command will create a docker image and _publish_ it to `harness/nextgenui` Dockerhub repo.
