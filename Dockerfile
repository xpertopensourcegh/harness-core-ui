FROM nginx:alpine

COPY dist /opt/nextgenui
COPY scripts/nginx.conf /etc/nginx/

WORKDIR /opt/nextgenui

RUN ls -lh

EXPOSE 80

CMD nginx -c /etc/nginx/nginx.conf -g 'daemon off;'