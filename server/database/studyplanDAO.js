/**
 *                            WEB APPLICATION I
 * ----------------------------------------------------------------------------
 *  Course: Web Application I
 *  Teacher: Fulvio Corno
 *  Date: 2022-06-23
 * ----------------------------------------------------------------------------
 * @file studyplanDAO.js manages the access to the DB related to the studyplan 
 * module, running the queries through the dao.js utilities and returning either 
 *       the resolved result or the rejected error.
 * @author Davide Arcolini
 * ----------------------------------------------------------------------------
*/
'use strict';

class StudyPlanDAO {

    /**
     * Constructor of the class StudyPlanDAO
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
     * Retrieves the list of codes of the exams that the 
     * student associated to the given studentID has chosen
     * in its career.
     * ---------------------------------------------------
     * @param {Number} studentID 
     * @return {Array} an Array of string
     */
    getStudyPlan = async (studentID) => {
        const querySQL = "SELECT code FROM STUDYPLANS WHERE STUDYPLANS.id == ?";
        try {
            const result = await this.dao.all(
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
     * Insert a new exam code in the list of exams codes that
     * the student associated to the given studentID has in 
     * its career.
     * ---------------------------------------------------
     * @param {Number} studentID 
     * @param {String} code
     */
    insertStudyPlan = async (studentID, code) => {
        const querySQL = "INSERT INTO STUDYPLANS(id, code) VALUES (?, ?)";
        try {
            const result = await this.dao.run(
                querySQL,
                [
                    studentID, 
                    code
                ]
            );
        } catch (error) {
            throw error;
        }
    }

    /**
     * Removes the list of codes of the exams that the 
     * student associated to the given studentID has chosen
     * in its career.
     * ---------------------------------------------------
     * @param {Number} studentID 
     */
    removeStudyPlan = async (studentID) => {
        const querySQL = "DELETE FROM STUDYPLANS WHERE STUDYPLANS.id == ?";
        try {
            const result = await this.dao.run(
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
}

module.exports = StudyPlanDAO;