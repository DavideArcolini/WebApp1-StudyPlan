/**
 *                            WEB APPLICATION I
 * ----------------------------------------------------------------------------
 *  Course: Web Application I
 *  Teacher: Fulvio Corno
 *  Date: 2022-06-23
 * ----------------------------------------------------------------------------
 * @file studyplanController.js links the studyplanRouter and the studyplanDAO, 
 * implementing the whole logic of the data retrieved, validating the result 
 * before responding to the user.
 * 
 * @author Davide Arcolini
 * ----------------------------------------------------------------------------
*/
'use strict';

/* --------- IMPORT MODULES --------- */
const StudyPlanDAO  = require('../database/studyplanDAO');
const ExamDAO       = require('../database/examsDAO');
const StudentsDAO   = require('../database/studentsDAO');

/* --------- VALIDATOR --------- */

/**
 * Validate the study plan. Constraints:
 *  - career is either 'Full Time' or 'Part Time' (checked on router)
 *  - credits complies with the career constraints
 *  - exams should:
 *          - contains existing exams
 *          - contains exams with available capacity
 *          - contains exams which do not complies with preparatory/incompatible constraints
 * @param {Object} studyPlan study plan to be validated
 * @param {Array} exams list of exams in the DB
 * @return True if the study plan is valid
 */
const validateStudyPlan = async (studyPlan, exams) => {

    /* checking credits based on career */
    if (studyPlan.career === 'Full Time') {
        if (studyPlan.credits < 60 || studyPlan.credits > 80) {
            return false;
        }
    } else {
        if (studyPlan.credits < 20 || studyPlan.credits > 40) {
            return false;
        }
    }

    /* checking that all exams exists */
    for (let examInStudyPlan of studyPlan.exams) {
       if ((exams.filter((element) => element.code === examInStudyPlan.code)) === undefined) {
            return false;
       }
    }

    /* checking preparatory constraints */
    for (let examInStudyPlan of studyPlan.exams) {
        if ((studyPlan.exams.filter((element) => element.code === examInStudyPlan.preparatory)) === undefined) {
            return false;
        }
    }

    /* checking incompatible constraints */
    for (let examInStudyPlan of studyPlan.exams) {
        if (examInStudyPlan.incompatible !== null) {
            let incompatibleExams = examInStudyPlan.incompatible.split('-');
            for (let incompatible of incompatibleExams) {
                if ((studyPlan.exams.filter((element) => element.code === incompatible)).length !== 0) {
                    return false;
                }
            }
        }
    }

    /* checking number of enrolled students */
    for (let examInStudyPlan of studyPlan.exams) {
        let exam = exams.filter((element) => element.code === examInStudyPlan.code)[0];
        if (exam.capacity !== null && exam.currentStudentsNumber === exam.capacity) {
            return false;
       }
    }

    return true;
}

class StudyPlanController {

    /**
     * Constructor of the class StudyPlanController
     * ----------------------------------------
     * @param {Object} dao 
     */
    constructor (dao) {
        this.studyPlanDAO   = new StudyPlanDAO(dao);
        this.examDAO        = new ExamDAO(dao);
        this.studentDAO     = new StudentsDAO(dao);
    }

    /*
        + -------------------- +
        |      FUNCTIONS       |
        + -------------------- +
    */


    /**
     * Retrieve the study plan of the student
     * associated to the given studentID
     * ---------------------------------------------
     *        API: GET /api/studyplan
     * =============================================
     * @param {Number} studentID the identifier of the student
    */
    getStudyPlan = async (studentID) => {
        try {
            /* retrieving the list of codes */
            const codes = await this.studyPlanDAO.getStudyPlan(studentID);

            /* retrieving the exams given the list of codes */
            const exams = [];
            let credits = 0;
            for (let code of codes) {
                const exam = await this.examDAO.getExamByCode(code.code);
                exams.push(exam);
                credits += exam.credits;
            }            
            return {
                code: 200,
                message: {
                    exams: exams,
                    credits: credits
                }
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Edit the study plan of the student associated 
     * to the given studentID
     * ---------------------------------------------
     *         API: PUT /api/studyplan
     * =============================================
     * @param {Number} studentID the identifier of the student
    */
    setStudyPlan = async (studentID, newStudyPlan) => {
        try {
            /*validating the new study plan */
            const exams = await this.examDAO.getExams();
            if (!validateStudyPlan(newStudyPlan, exams)) {
                throw new Error();
            }

            /* updating the student career */
            await this.studentDAO.updateStudent(studentID, newStudyPlan.career);

            /* removing old study plan */
            let result = await this.studyPlanDAO.getStudyPlan(studentID);
            for (let code of result) {
                const exam = await this.examDAO.getExamByCode(code.code);
                await this.examDAO.updateExam(code.code, exam.currentStudentsNumber - 1);
            }
            await this.studyPlanDAO.removeStudyPlan(studentID);

            /* inserting new study plan */
            for (let exam of newStudyPlan.exams) {
                await this.studyPlanDAO.insertStudyPlan(studentID, exam.code);
            }
            result = await this.studyPlanDAO.getStudyPlan(studentID);
            for (let code of result) {
                const exam = await this.examDAO.getExamByCode(code.code);
                await this.examDAO.updateExam(code.code, exam.currentStudentsNumber + 1);
            }

            return {
                code: 201,
                message: 'Created'
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Remove the study plan of the student associated 
     * to the given studentID
     * ---------------------------------------------
     *         API: DELETE /api/studyplan
     * =============================================
     * @param {Number} studentID the identifier of the student
     */
    deleteStudyPlan = async (studentID) => {
        try {
            /* updating enrolled students */
            const result = await this.studyPlanDAO.getStudyPlan(studentID);
            for (let code of result) {
                const exam = await this.examDAO.getExamByCode(code.code);
                await this.examDAO.updateExam(code.code, exam.currentStudentsNumber - 1);
            }

            /* removing corresponding study plan in DB */
            await this.studyPlanDAO.removeStudyPlan(studentID);

            /* removing career  */
            await this.studentDAO.updateStudent(studentID, null);

            return {
                code: 204,
                message: 'No Content'
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = StudyPlanController;