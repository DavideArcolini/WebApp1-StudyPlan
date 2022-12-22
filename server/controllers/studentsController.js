/**
 *                            WEB APPLICATION I
 * ----------------------------------------------------------------------------
 *  Course: Web Application I
 *  Teacher: Fulvio Corno
 *  Date: 2022-06-23
 * ----------------------------------------------------------------------------
 * @file studentsController.js links the studentsRouter and the studentsDAO, 
 * implementing the whole logic of the data retrieved, validating the result before
 *       responding to the user.
 * @author Davide Arcolini
 * ----------------------------------------------------------------------------
*/
'use strict';

/* --------- IMPORT MODULES --------- */
const StudentsDAO   = require('../database/studentsDAO');
const crypto        = require('crypto');


class StudentsController {

    /**
     * Constructor of the class StudentsController
     * ----------------------------------------
     * @param {Object} dao 
     */
    constructor (dao) {
        this.studentsDAO = new StudentsDAO(dao);
    }

    /**
     * Retrieve the specific student information given 
     * the username and the password
     * ---------------------------------------------
     *    API: GET /api/student/sessions/current
     * =============================================
    */
    getStudent = async (username, password) => {
        try {

            /* retrieving student from DB */
            const result = await this.studentsDAO.getStudent(username);
            if (result === undefined) {
                return false;
            }

            /* student exists, let's check the password */
            return new Promise((resolve, reject) => {
                const student = {
                    id: result.id,
                    name: result.name,
                    surname: result.surname,
                    career: result.career
                };

                /* check if password provided is matching */
                crypto.scrypt(
                    password,       /* plain-text password */
                    result.salt,    /* salt of the stored password */
                    32,             /* keylen */
                    (error, hashedPassword) => {
                        if (error) {
                            console.log(error);
                            throw new Error(error.message);
                        }

                        if (!crypto.timingSafeEqual(Buffer.from(result.hash, 'hex'), hashedPassword)) {
                            resolve(false);
                        } else {
                            resolve(student);
                        }
                    }
                );
            });

        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieve the specific student information given 
     * its identifier.
     * ---------------------------------------------
     *    API: GET /api/student/sessions/current
     * =============================================
     * @param {Numbert} studentID database identifier of the student
     */
    getStudentByID = async (studentID) => {
        try {
            const result = await this.studentsDAO.getStudentByID(studentID);
            return result === undefined ? false : result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = StudentsController;