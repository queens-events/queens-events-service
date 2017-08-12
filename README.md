# Queens Events Service

### Author: Stephen Peterkins

# Installation

``yarn``
``yarn add <Backend Store>``
``cp .env.sample.env``
Edit the .env file to suit your needs

# Running
- *production* ``npm start``
- *development* ``npm run dev``

# Environment Variables
- *DB_HOST* database host
- *DB_USER* database username
- *DB_PASS* database password
- *DB_DIALECT* database dialect, example mysql
- *DB_SCHEMA_NAME* database schema name
- *DEBUG_LEVEL* debug level for logging
- *WEB_PORT* Port to listen on

# Database

## Migrations
Queens Events Service is able to bootstrap itself via sequelize migrations

- Install the sequelize-cli ``npm install -g sequelize``
- Run the migrations ``sequelize db:migrate``

Docs here for [modifying/creating migrations](http://docs.sequelizejs.com/manual/tutorial/migrations.html)

## Backend Store
Sequelize is being used as an abstract layer between the database and the service. The following can be used to connect to these dbs.
- Postgres (pg pg-hstore)
- Mysql (mysql2)
- MSSQL (tedious)
- Sqlite3 (sqlite3) * Limited functionality

## Web Server

### [Express](https://expressjs.com)

## Logger

### [Winston](https://winston.com)