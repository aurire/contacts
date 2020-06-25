## Phonebook contacts

This is a simple phonebook contacts management and sharing app, allowing you to save, edit, delete contacts with their phone numbers and share them with other users.

Project consists of docker files for containerized services initialization, symfony for backend, React for frontend.
Database: mysql, server: Apache2.

To start, run in root directory
### `docker-compose up`

To stop ctrl+c, and 
### `docker-compose down`

#Docker
Docker is used to compose environment which consists of:
Php 7.4, Apache2, Mysql, some helper utilities (composer, wait-for-it)

#Backend
Backend is implemented using symfony and is used primarily for api. Packages:
Api Platform - very good api package for symfony, allows very easy, yet very controlled API development.
nelmio_cors - for CORS
others are more or less standard.

For API customization, extended:
* custom serialization;
* custom context builder;
* added security voters;

I only implemented functional tests as there were little logic for Unit testing.

Api is presented as OpenApi(swagger) at:
http://localhost/api 

#Frontend
Frontend is made using React and:
React Redux - state management
React router - dynamic routing
React bootstrap - styling
axios - asynchronous ajax calls
Redux thunk - allowing functions for redux actions for axios integration.

For frontend development, run
### `npm start`
in front directory.
To build frontend and copy to backend(symfony folder), run 
### `./build.sh`
