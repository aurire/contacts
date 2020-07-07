FROM node:alpine AS nodep

RUN apk update; \
    apk upgrade;
COPY ./sites/phonebook.rekstys.lt/front/package.json /usr/app/phonebook.rekstys.lt/package.json
WORKDIR /usr/app/phonebook.rekstys.lt
RUN npm install
COPY ./sites/phonebook.rekstys.lt/front/ /usr/app/phonebook.rekstys.lt/
RUN npm run build
