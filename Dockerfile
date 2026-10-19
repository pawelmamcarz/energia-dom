FROM caddy:2.10.2-alpine
COPY koszty_energii_dom.html /srv/
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 8080
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
