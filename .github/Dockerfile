FROM docker.io/wordpress:php8.0-apache

RUN apt-get -y update && apt-get -y --no-install-recommends install less \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*

RUN curl https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar --output /usr/bin/wp \
	&& chmod +X /usr/bin/wp \
	&& chmod 766 /usr/bin/wp
