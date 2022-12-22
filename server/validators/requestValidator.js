/**
 *                            WEB APPLICATION I
 * ----------------------------------------------------------------------------
 *  Course: Web Application I
 *  Teacher: Fulvio Corno
 *  Date: 2022-06-23
 * ----------------------------------------------------------------------------
 * @file requestValidator.js handles the checks on the HTTP requests.
 * @author Davide Arcolini
 * ----------------------------------------------------------------------------
*/
'use strict';

/* --------- ERROR MESSAGES --------- */
const ERROR_422 = {code: 422, message: 'Unprocessable entity'};

/* --------- EXPRESS VALIDATOR --------- */
const { validationResult } = require('express-validator');

/**
 * Middleware to validate the request body
 * ------------------------------------------------
 * @param {Object} request HTTP request 
 * @param {Object} response HTTP response
 * @param {Function} next move to the next validation
 */
function validationHandler(request, response, next) {

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(ERROR_422.code).json(ERROR_422.message);
    }

    next();
}

module.exports = { validationHandler };