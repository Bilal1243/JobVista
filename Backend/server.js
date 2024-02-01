import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import cookieParser from "cookie-parser";
import connectDb from './config/db.js'
import cors from 'cors'
import { notFound, errorHandler } from './Middlewares/errorHandlers.js';

const app = express()

app.use(express.json());
app.use(express.urlencoded({ limit: "30mb", extended: true }))
app.use(cookieParser())
app.use(express.static("Backend/Public"));

const port = process.env.PORT || 2000
connectDb()

app.use(cors({
  origin: 'http://localhost:3000', // Update with your frontend port
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));


import userRoutes from './Routes/userRoutes.js';
import adminRoutes from './Routes/adminRoutes.js';
import recruiterRoute from './Routes/recruiterRoutes.js';

app.use('/api/users', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/recruiter', recruiterRoute)

app.use(notFound);
app.use(errorHandler);


app.listen(port, () => {
  console.log(`server started on port ${port}`)
})