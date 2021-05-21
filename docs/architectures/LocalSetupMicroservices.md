# Dev setup for multiple UI microservices

Different parts of the NextGen UI application can be split into different repos/services (eg. [ng-auth-ui](https://github.com/wings-software/ng-auth-ui/) is the authentication UI).

To run the complete UI experience on your local system, you might need to run multiple services locally.

In most deployed environments (like PR, QA, QB, Prod etc) routing between multiple services is managed by [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/). This can be replicated locally via a simple nginx config.

## How to manage mutiple local services

Steps:

1. Build each individual services into their dist folders

```
$ yarn build
```

or start dev build in watch mode (without server)

```
$ yarn watch
```

> Info: the commands might vary for each service. Check `package.json` for exact commands

> Info: Services running their own server makes the routing more difficult in local since it requires code changes in each service's server config. i.e. don't use `yarn dev`).

2. Install `nginx`

```
$ brew install nginx
```

3. Create the config file (your path might be different)

```
$ touch /usr/local/etc/nginx/servers/harness.conf
```

4. Copy this into the new config file

```nginx
access_log /usr/local/var/log/nginx/access.log;
error_log /usr/local/var/log/nginx/error.log;

# nextgenui
server {
  listen      8181;
  server_name localhost;

  # set your absolute repo path here
  root /path/to/nextgenui;

  location = / {
    try_files /dist/index.html =404;
  }

  location / {
    try_files /dist/$uri =404;
  }
}

# ng-auth-ui
server {
  listen      3000;
  server_name localhost;

  # set your absolute repo path here
  root /path/to/ng-auth-ui;

  location = / {
    try_files /dist/index.html =404;
  }

  location / {
    try_files /dist/$uri =404;
  }
}

# ingress
server {
  listen  8080 ssl;
  server_name localhost;

  # change these to your paths
  ssl_certificate     /path/to/nextgenui/certificates/localhost.pem;
  ssl_certificate_key /path/to/nextgenui/certificates/localhost-key.pem;

  # frontend services
  location / {
    proxy_pass http://localhost:8181/;
  }

  location /auth {
    proxy_pass http://localhost:3000/;
  }

  # backend services
  location /api {
    proxy_pass https://localhost:9090/;
  }

  location /ng/api/ {
    proxy_pass https://localhost:7090/;
  }

  # add more BE services here as needed
}

```

5. Start nginx service

```
$ brew services start nginx
```

6. Manage nginx service (if needed)

```
$ brew services stop nginx
$ brew services restart nginx
```

You should now be able to run the UI on https://localhost:8080 (or whatever you configured above).

This sample config will run new servers for the following:

- nextgenui on port 8181
- ng-auth-ui on port 3000
- root ssl server on port 8080

To read more about using `nginx` as a reverse-proxy, see the [nginx docs](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/).
