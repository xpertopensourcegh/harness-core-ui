# Harness Next Gen UI

### Nginx Config

You need to run nginx on your local machine to run `wingsui` and `nextgenui` simultaneously. This is required because some critical functionality (login, signup etc) is still not migrated to nextgen.

Use this nginx config and replace <> with appropriate paths:

<details>
  <summary>Click here to expand</summary>
  
```
access_log /usr/local/var/log/nginx/access.log;
error_log /usr/local/var/log/nginx/error.log;

# wingsui
server {
  listen      8182 ssl;
  server_name localhost;
  
  ssl_certificate     <certificate path>;
  ssl_certificate_key <key path>;
  
  root <wingsui code path>/wingsui;

  location = / {
    try_files /static/index.html =404;
  }

  location / {
    try_files /static/$uri /src/static/$uri =404;
  }
}

#nextgen v2
server {
  listen      8183 ssl;
  server_name localhost;
  
  ssl_certificate     <certificate path>;
  ssl_certificate_key <key path>;
  
  root <nextgenui code path>/nextgenui;

  location = / {
    try_files /dist/index.html =404;
  }

  location / {
    try_files /dist/$uri =404;
  }
}

# gateway
server {
  listen  8181 ssl;
  server_name localhost;
  
  ssl_certificate     <certificate path>;
  ssl_certificate_key <key path>;

  location /api {
    proxy_pass https://localhost:9090;
  }

  location /v2 {
    proxy_pass https://localhost:8183/;
  }

  location / {
    proxy_pass https://localhost:8182;
  }
}
```  
</details>

