/**
 *                            WEB APPLICATION I
 * ----------------------------------------------------------------------------
 *  Course: Web Application I
 *  Teacher: Fulvio Corno
 *  Date: 2022-06-23
 * ----------------------------------------------------------------------------
 * @file examsDAO.js manages the access to the DB related to the exam module, 
 *       running the queries through the dao.js utilities and returning either 
 *       the resolved result or the rejected error.
 * @author Davide Arcolini
 * ----------------------------------------------------------------------------
*/
'use strict';

class ExamsDAO {

    /**
     * Constructor of the class ExamsDAO
     * @param {Object} dao
     */
    constructor (dao) {
        this.dao = dao;
    }

    /*
        + -------------------- +
        |      FUNCTIONS       |
        + -------------------- +
    */

    /**
     * Retrieves the whole list of exams from the database
     * and sort it alphabetically by name.
     * ---------------------------------------------------
     * @returns An Array containing all the exams
     */
    getExams = async () => {
        const querySQL = "SELECT * FROM EXAMS";
        try {
            const result = await this.dao.all(querySQL);
            return result.sort((examA, examB) => {return examA.name.localeCompare(examB.name)});
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieves the specific exam that corresponds to the
     * given code identifier.
     * ----------------------------------------------------
     * @param {String} code code identifier of the exam
     * @returns the exam corresponding to the given code
     */
    getExamByCode = async (code) => {
        const querySQL = "SELECT * FROM EXAMS WHERE EXAMS.code == ?";
        try {
            const result = await this.dao.get(
                querySQL,
                [
                    code
                ]
            );
            return result;
        } catch (error) {
            throw error;
        }   
    }

    /**
     * Updates the current number of enrolled students of the
     * given exam.
     * ----------------------------------------------------
     * @param {String} code 
     * @param {Number} enrolledStudents 
     */
    updateExam = async (code, enrolledStudents) => {
        const querySQL = "UPDATE EXAMS SET currentStudentsNumber = ? WHERE code == ?";
        try {
            const result = await this.dao.run(
                querySQL,
                [
                    enrolledStudents, 
                    code
                ]
            );
            return result;
        } catch (error) {
            throw error;
        }

    }
}

module.exports = ExamsDAO;