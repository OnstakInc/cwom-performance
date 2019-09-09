const Sequelize = require('sequelize');

const DB_HOST = '172.16.190.31';
const DB_NAME = 'AdventureWorks2012';
const DB_USERNAME = 'admin';
const DB_PASSWORD = 'Onstak123';

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

// sequelize
//     .authenticate()
//     .then(() => {
//         console.log('Database connection established...');
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//         process.exit(0);
//     });

sequelize.query('SELECT * FROM Person.Person;', { type: sequelize.QueryTypes.SELECT })
    .then(result => {

        console.log(result);

        sequelize.query('SELECT * FROM Sales.SalesPerson;', { type: sequelize.QueryTypes.SELECT })
            .then(result => {
                console.log(result);
                process.exit(0);
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
                process.exit(0);
            });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
        process.exit(0);
    });
