/**
 *                            WEB APPLICATION I
 * ----------------------------------------------------------------------------
 *  Course: Web Application I
 *  Teacher: Fulvio Corno
 *  Date: 2022-06-23
 * ----------------------------------------------------------------------------
 * @file studentsDAO.js manages the access to the DB related to the student module, 
 *       running the queries through the dao.js utilities and returning either 
 *       the resolved result or the rejected error.
 * @author Davide Arcolini
 * ----------------------------------------------------------------------------
*/
'use strict';

class StudentsDAO {

    /**
     * Constructor of the class StudentsDAO
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
     * Retrieve the student which corresponds to the credentials 
     * provided.
     * ----------------------------------------------------------
     * @param {String} username email of the user to be retrieved
    */
    getStudent = async (username) => {
        const querySQL = "SELECT * FROM STUDENTS WHERE STUDENTS.username == ?";
        try {
            const result = await this.dao.get(
                querySQL, [
                    username
                ]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieve the student information associated to the given studentID
     * ------------------------------------------------------------------
     * @param {Number} studentID database identifier of the student
     * @returns The student associated to the given studentID
     */
    getStudentByID = async (studentID) => {
        const querySQL = "SELECT * FROM STUDENTS WHERE STUDENTS.id == ?";
        try {
            const result = await this.dao.get(
                querySQL,
                [
                    studentID
                ]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update the career of the student corresponding to the given
     * studentID
     * ----------------------------------------------------------
     * @param {Number} studentID 
     * @param {String} career new career to be stored in the DB
     */
    updateStudent = async (studentID, career) => {
        const querySQL = "UPDATE STUDENTS SET career = ? WHERE id == ?";
        try {
            const result = await this.dao.run(
                querySQL, 
                [
                    career,
                    studentID
                ]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = StudentsDAO;