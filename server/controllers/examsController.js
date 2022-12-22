/**
 *                            WEB APPLICATION I
 * ----------------------------------------------------------------------------
 *  Course: Web Application I
 *  Teacher: Fulvio Corno
 *  Date: 2022-06-23
 * ----------------------------------------------------------------------------
 * @file examsController.js links the examsRouter and the examsDAO, implementing
 *       the whole logic of the data retrieved, validating the result before
 *       responding to the user.
 * @author Davide Arcolini
 * ----------------------------------------------------------------------------
*/
'use strict';

/* --------- IMPORT MODULES --------- */
const ExamsDAO = require('../database/examsDAO');

/* --------- ERROR MESSAGES --------- */
const ERROR_404 = {code: 404, message: 'Not found'};

class ExamsController {

    /**
     * Constructor of the class ExamsController
     * ----------------------------------------
     * @param {Object} dao 
     */
    constructor (dao) {
        this.examsDao = new ExamsDAO(dao);
    }

    /*
        + -------------------- +
        |      FUNCTIONS       |
        + -------------------- +
    */

    /**
     * Retrieve the whole list of exams, sorted
     * alphabetically, from the DB.
     * ---------------------------------------------
     *            API: GET /api/exams
     * =============================================
    */
    getExams = async () => {
        try {
            /* retrieving exams from DB */
            const exams = await this.examsDao.getExams();
            return {
                code: 200,
                message: exams
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieves the specific exam that corresponds to the
     * given code identifier.
     *  ---------------------------------------------
     *        API: GET /api/exams/:code
     * =============================================
     * @param {String} code code identifier of the exam
     */
    getExamByCode = async (code) => {
        try {
            /* retrieving specific exam from DB */
            const exam = await this.examsDao.getExamByCode(code);
            
            /* evaluating result */
            return (exam === undefined) ? ERROR_404 : {
                code: 200,
                message: exam
            };
        } catch (error) {
            throw error
        }
    }
}

module.exports = ExamsController;