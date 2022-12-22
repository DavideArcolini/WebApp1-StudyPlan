/**
 *                            WEB APPLICATION I
 * ----------------------------------------------------------------------------
 *  Course: Web Application I
 *  Teacher: Fulvio Corno
 *  Date: 2022-06-23
 * ----------------------------------------------------------------------------
 * @file studentsRouter.js manages the back-end API related to the student 
 * module, including:
 *          - validation of requests
 *          - authentication
 *          - management of responses
 * @author Davide Arcolini
 * ----------------------------------------------------------------------------
*/
'use strict';

/* --------- MODULE IMPORTS --------- */
const express               = require("express");
const passport              = require('passport');
const StudentsController    = require('../controllers/studentsController');
const DAO                   = require('../database/dao');

/* ---------- ROUTER INITIALIZATIONS ---------- */
const router            = express.Router();
const dao               = new DAO();
const studentController = new StudentsController(dao);

/* --------- API DEFINITIONS --------- */

/**
 *  API:
 *          POST /api/student/sessions
 *  ---------------------------------------------
 *  Create a logged session for the current user,
 *  authenticated with a Local-Strategy
 *  ---------------------------------------------
*/
router.post(
    '/sessions',
    passport.authenticate('local'),
    async (request, response) => {
        response.status(201).json(request.user);
    }
);

/**
 *  API:
 *       GET /api/student/sessions/current
 *  ---------------------------------------------
 *  Retrieve the current session for the given user
 *  ---------------------------------------------
*/
router.get(
    '/sessions/current',
    async (request, response) => {
        try {
            if (request.isAuthenticated()) {
                const result = await studentController.getStudentByID(request.user.id);
                return response.json(result);
            } else {
                return response.status(401).json({error: 'Not Authenticated'});
            }
        } catch (error) {
            throw error;
        }
    }
);

/**
 *  API:
 *       DELETE /api/student/sessions/current
 *  ---------------------------------------------
 *  Delete the current session
 *  ---------------------------------------------
*/
router.delete(
    '/sessions/current',
    async (request, response) => {

        request.logOut(() => {
            response.end();
        });
    }
);

module.exports = router;