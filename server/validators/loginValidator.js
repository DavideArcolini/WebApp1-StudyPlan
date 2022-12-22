/**
 *                            WEB APPLICATION I
 * ----------------------------------------------------------------------------
 *  Course: Web Application I
 *  Teacher: Fulvio Corno
 *  Date: 2022-06-23
 * ----------------------------------------------------------------------------
 * @file loginValidator.js handles the authentication on the HTTP requests.
 * @author Davide Arcolini
 * ----------------------------------------------------------------------------
*/
'use strict';

/* --------- ERROR MESSAGES --------- */
const ERROR_401 = {code: 401, message: 'Not authorized'};

/**
 * Middleware to authenticate the request body
 * ------------------------------------------------
 * @param {Object} request HTTP request 
 * @param {Object} response HTTP response
 * @param {Function} next move to the next validation
 */
function isLoggedIn(request, response, next) {

    if (request.isAuthenticated()) {
        next();
    } else {
        return response.status(ERROR_401.code).json(ERROR_401.message);
    }
}

module.exports = { isLoggedIn }