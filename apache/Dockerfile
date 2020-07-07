ARG APACHE_VERSION=""
FROM httpd:${APACHE_VERSION:+${APACHE_VERSION}-}alpine

RUN apk update; \
    apk upgrade;

# Copy apache vhost file to proxy php requests to php-fpm container
COPY apache/my.apache.conf /usr/local/apache2/conf/my.apache.conf
RUN echo "Include /usr/local/apache2/conf/my.apache.conf" \
    >> /usr/local/apache2/conf/httpd.conf

COPY sites/phonebook.rekstys.lt/symfony/public/ /var/www/html/phonebook.rekstys.lt/symfony/public/
COPY --from=nodec /usr/app/phonebook.rekstys.lt/build/ /var/www/html/phonebook.rekstys.lt/symfony/public/
