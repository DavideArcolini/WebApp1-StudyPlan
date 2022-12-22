/**
 *                            WEB APPLICATION I
 * ----------------------------------------------------------------------------
 *  Course: Web Application I
 *  Teacher: Fulvio Corno
 *  Date: 2022-06-23
 * ----------------------------------------------------------------------------
 * @file index.js manages set-up and start-up of the back-end Web Application
 * @author Davide Arcolini
 * ----------------------------------------------------------------------------
*/
'use strict';

/* --------- MODULE IMPORTS --------- */
const express       = require('express');
const morgan        = require('morgan');
const cors          = require("cors");      /* NB: in production mode, use different domains for React and API servers, NEVER allow CORS requests from any origin, always specify origin. */

/* ---------- IMPORT ROUTERS ---------- */
const examsRouter       = require('./routers/examsRouter');
const studentRouter     = require('./routers/studentsRouter');
const studyplanRouter   = require('./routers/studyplanRouter');

/* ---------- IMPORT PASSPORT MODULES ---------- */
const passport      = require("passport");
const LocalStrategy = require("passport-local");
const session       = require('express-session');

/* --- CROSS-ORIGIN RESOURCE SHARING OPTION --- */
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
};

/* --- SETTING UP PASSPORT --- */
const DAO                   = require('./database/dao');
const StudentsController    = require('./controllers/studentsController');
const dao                   = new DAO();
const studentController     = new StudentsController(dao);

passport.use(new LocalStrategy(
    async function verify (username, password, callback) {
        const student = await studentController.getStudent(username, password);
        return (!student) ? callback(null, false, 'Incorrect username or password!') : callback(null, student);
    }
));
passport.serializeUser(
    (student, callback) => {
        callback(null, student);
    }
);
passport.deserializeUser(
    (student, callback) => {
        callback(null, student);
    }
);

/* --------- SERVER INITIALIZATION --------- */
const app = new express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(session(
    {
        secret: "superSecretSecret",
        resave: false,
        saveUninitialized: false
    }
));
app.use(passport.authenticate('session'));

/* --------- SETTING UP ROUTES --------- */
app.use("/api/exams", examsRouter);
app.use("/api/student", studentRouter);
app.use("/api/studyplan", studyplanRouter);


/* --------- SERVER START-UP --------- */
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});