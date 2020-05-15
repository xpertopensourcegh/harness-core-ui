FROM nginx:alpine

COPY dist /opt/nextgenui
COPY scripts/nginx.conf /etc/nginx/

WORKDIR /opt/nextgenui

RUN ls -lh

EXPOSE 80

CMD sed -i "s|<\!-- apiurl -->|<script>window.apiUrl = '$API_URL/api'</script>|" index.html && \ 
    nginx -c /etc/nginx/nginx.conf -g 'daemon off;'