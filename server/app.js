
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from 'path';

const __dirname = path.resolve();
dotenv.config();

const app = express();

import authentication from './routes/authentication.js'
import manufacturer from './routes/manufacturer.js'
import transporter from './routes/transporter.js'
import common from './routes/common.js'

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json());
app.use(cors());
app.use('/api/images', express.static(path.join(__dirname, 'public/images')));

const CONNECTION_URL = process.env.DATABASE;
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
        console.log('Database is connected');
    })
    .catch((error) => {
        console.error('Error connecting to the database:', error);
    });



app.use('/authentication', authentication)
app.use('/manufacturer', manufacturer)
app.use('/transporter', transporter)
app.use('/common', common)


// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });



