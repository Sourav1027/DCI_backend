const {configDotenv} = require('dotenv');
const Sequelize = require('sequelize');
configDotenv()

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host : process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        // logging:false,
    },

)

const connectDB= async () =>{
    try {
        await sequelize.authenticate();
        console.log('Connect Database Successfully')
    } catch (error) {
        console.log('Unable to connect to the database',error);
    }
}

module.exports = {connectDB,sequelize}