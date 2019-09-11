#!/usr/bin/env node

require('appdynamics').profile({
    controllerHostName: process.env.APPD_HOST,
    controllerPort: parseInt(process.env.APPD_PORT),
    controllerSslEnabled: true,
    accountName: process.env.APPD_ACCOUNT,
    accountAccessKey: process.env.APPD_KEY,
    applicationName: process.env.APPD_APP,
    tierName: process.env.APPD_TIER,
    nodeName: process.env.APPD_NODE
});

const http = require('http');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const os = require('os');
const Sequelize = require('sequelize');

const HOST = process.env.HOST || 'localhost';
const PORT = parseInt(process.env.PORT) || 8080;

const DB_HOST = '172.16.190.31';
const DB_NAME = 'AdventureWorks2012';
const DB_USERNAME = 'admin';
const DB_PASSWORD = 'Onstak123';

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.get('/', (req, res, next) => {
    return res.json({
        hostname: os.hostname(),
        platform: os.platform(),
        uptime: os.uptime(),
        network: os.networkInterfaces()
    });
});

app.get('/api/v1/persons', async (req, res, next) => {
    try {
        let result = await getPersons();
        return res.json(result);
    } catch (err) {
        console.log(err.message);
    }
});

app.get('/api/v1/sales', async (req, res, next) => {
    try {
        let result = await getSales();
        return res.json(result);
    } catch (err) {
        console.log(err.message);
    }
});

app.get('/health', (req, res, next) => {
    return res.json();
});


app.use((req, res, next) => {
    return res.status(404).json({
        status: 'Not Found',
        statusCode: 404
    });
});

async function getPersons() {

    const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
        host: DB_HOST,
        dialect: 'mssql',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });

    let result = await sequelize.query('SELECT * FROM Person.Person;', { type: sequelize.QueryTypes.SELECT });

    return result;
}

async function getSales() {

    const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
        host: DB_HOST,
        dialect: 'mssql',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });

    let result = await sequelize.query('SELECT * FROM Sales.SalesPerson;', { type: sequelize.QueryTypes.SELECT });

    return result;
}

/**
 * Create server module
 */
const server = http.createServer(app);

server.listen(PORT, HOST);
server.on('error', onError);
server.on('listening', onListening);

function onListening() {
    console.log(`Server is listening on http://${server.address().address}:${server.address().port}`);
}

function onError(err) {
    console.error(err.message);
    process.exit(1);
}
