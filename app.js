const express = require ('express')
const User = require('./model/user/user')
const {connectDB ,sequelize } = require('./config/database')
const userRoute = require('./route/userRoute')
const loginRoute = require('./route/loginRoute')
const cors = require('cors'); 
const centerRoute = require('./route/centerRoute'); // Add centerRoute
const courseRoute = require('./route/courseRoute'); // Add centerRoute
const batchRoute = require('./route/batchRoute');
const studentRoute = require('./route/studentRoute');
const trainerRoute = require('./route/trainerRoute');
const syllabusRoute = require('./route/syllabusRoute');
const feeupdateRoute = require('./route/feeupdateRoute');
const enquiryRoute = require('./route/enquiryRoute');
const remarksRoute = require('./route/remarksRoute');
const smsRoute = require('./route/smsRoute');
const skillmarkRoute = require('./route/skillmarksRoute');


const app = express()

// CORS Middleware Configuration
const corsOptions = {
    origin: 'http://localhost:3000', // Frontend URL (adjust accordingly for prod)
    methods: 'GET, POST, PUT, DELETE', // Methods allowed
    allowedHeaders: 'Content-Type, Authorization', // Headers allowed
  };

app.use(cors(corsOptions));
app.use(express.json());


app.use("/v1/user",userRoute)
app.use("/v1/login", loginRoute);
app.use("/v1/centers", centerRoute);
app.use("/v1/courses", courseRoute);
app.use("/v1/batches", batchRoute);
app.use('/v1/students', studentRoute);
app.use('/v1/trainers', trainerRoute);
app.use('/v1/syllabuses', syllabusRoute);
app.use('/v1/feeUpdates', feeupdateRoute);
app.use('/v1/enquiries',enquiryRoute);
app.use('/v1/remarks',remarksRoute);
app.use('/v1/sms',smsRoute);
app.use('/v1/skills',skillmarkRoute);


const init = async() =>{
    await connectDB()
    await sequelize.sync({alter:true})
}

const port = process.env.PORT || 5000
app.listen(5000, ()=>{
    console.log(`sever listen on the http://localhost:${port}`)
})

init()  