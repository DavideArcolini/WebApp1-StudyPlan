/**
 *                            WEB APPLICATION I
 * ----------------------------------------------------------------------------
 *  Course: Web Application I
 *  Teacher: Fulvio Corno
 *  Date: 2022-06-23
 * ----------------------------------------------------------------------------
 * @file examsRouter.js manages the back-end API related to the exam module, 
 *       including:
 *          - validation of requests
 *          - authentication
 *          - management of responses
 * @author Davide Arcolini
 * ----------------------------------------------------------------------------
*/
'use strict';

/* --------- MODULE IMPORTS --------- */
const express               = require("express");
const ExamsController       = require("../controllers/examsController");
const DAO                   = require("../database/dao");
const { param }             = require('express-validator');
const { body }              = require('express-validator');
const { validationHandler } = require("../validators/requestValidator");

/* ---------- ROUTER INITIALIZATIONS ---------- */
const router            = express.Router();
const dao               = new DAO();
const examsController   = new ExamsController(dao);


/* --------- API DEFINITIONS --------- */

/**
 *  API:
 *             GET /api/exams
 *  ---------------------------------------------
 *  Retrieve the whole list of exams, sorted
 *  alphabetically by name, from the DB.
 *  ---------------------------------------------
*/
router.get(
    '',
    [
        body().custom(value => {  /* [FROM README.md]: body should be empty */
            return (Object.keys(value).length !== 0) ? false : true;
        })
    ],
    validationHandler,
    async (request, response) => {
        try {
            const result = await examsController.getExams();
            return response.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
);

/**
 *  API:
 *           GET /api/exams/:code
 *  ---------------------------------------------
 * Retrieves the specific exam that corresponds to 
 * the given code identifier.
 *  ---------------------------------------------
*/
router.get(
    '/:code',
    [
        param('code').isString().isLength({eq: 7}),     /* [FROM README.md]: code is a string of 7 characters */
        body().custom(value => {                        /* [FROM README.md]: body should be empty */
            return (Object.keys(value).length !== 0) ? false : true;
        })
    ],
    validationHandler,
    async (request, response) => {
        try {
            const result = await examsController.getExamByCode(request.params.code);
            return response.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
);

module.exports = router;