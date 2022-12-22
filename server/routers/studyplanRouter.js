/**
 *                            WEB APPLICATION I
 * ----------------------------------------------------------------------------
 *  Course: Web Application I
 *  Teacher: Fulvio Corno
 *  Date: 2022-06-23
 * ----------------------------------------------------------------------------
 * @file studyplanRouter.js manages the back-end API related to the exam module, 
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
const StudyPlanController   = require('../controllers/studyplanController');
const DAO                   = require("../database/dao");
const { header }            = require('express-validator');
const { body }              = require('express-validator');
const { validationHandler } = require("../validators/requestValidator");
const { isLoggedIn }        = require('../validators/loginValidator');

/* ---------- ROUTER INITIALIZATIONS ---------- */
const router                = express.Router();
const dao                   = new DAO();
const studyplanController   = new StudyPlanController(dao);


/* --------- API DEFINITIONS --------- */

/**
 *  API:
 *                      API: GET /api/studyplan
 *  ------------------------------------------------------------------------
 *  Retrieve the study plan of the student associated to the given studentID
 *  ------------------------------------------------------------------------
*/
router.get(
    '',
    [
        body().custom(value => {  /* [FROM README.md]: body should be empty */
            return (Object.keys(value).length !== 0) ? false : true;
        })
    ],
    validationHandler,
    isLoggedIn,
    async (request, response) => {
        try {
            const result = await studyplanController.getStudyPlan(request.session.passport.user.id);
            return response.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
);

/**
 *  API:
 *                      API: PUT /api/studyplan
 *  ------------------------------------------------------------------------
 *  Edit the study plan of the student associated to the given studentID
 *  ------------------------------------------------------------------------
*/
router.put(
    '',
    [
        header('Content-Type').equals('application/json'),  /* [FROM README.md]: Request header has a line: Content-Type: application/json. */
        body().custom((body) => {                           /* [FROM README.md]: career, exams and credits are mandatory parameters         */
            return !(body.career === undefined && body.exams !== undefined && body.credits !== undefined);
        }),
        body('career').custom((value) => {
            return (value === 'Full Time' || value === 'Part Time');
        }), 
        body('credits').custom((value) => {
            return value >= 0;
        })
    ],
    validationHandler, 
    isLoggedIn,
    async (request, response) => {
        try {
            const result = await studyplanController.setStudyPlan(request.session.passport.user.id, request.body);
            return response.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
);

/**
 *  API:
 *                      API: DELETE /api/studyplan
 *  ------------------------------------------------------------------------
 *  Remove the study plan of the student associated to the given studentID
 *  ------------------------------------------------------------------------
*/
router.delete(
    '',
    [
        body().custom(value => {  /* [FROM README.md]: body should be empty */
            return (Object.keys(value).length !== 0) ? false : true;
        })
    ],
    validationHandler, 
    isLoggedIn,
    async (request, response) => {
        try {
            const result = await studyplanController.deleteStudyPlan(request.session.passport.user.id);
            return response.status(result.code).json(result.message);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
);


module.exports = router;