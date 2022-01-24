const Sequelize = require('sequelize');
const connection = new Sequelize('perguntasnew','root','654321',{
    host:'localhost',
    dialect:'mysql'
});

module.exports = connection;
