/* --------- BACK-END SERVER ENDPOINTS INFORMATION --------- */
const PORT          = 3001 ;
const PREFIX_URL    = `http://localhost:${PORT}`;

class API {

    /*
        + ------------------------ +
        |    API TO REACH SERVER   |
        + ------------------------ +

        API.js implements the API exposed by the Web Application to
        communicate with the server-side.
    */


    /**
     * Attempt to perform login with the given credentials
     * ==========================================================
     * @param {Object} credentials
     * @returns the Student associated to the current session on success
     * Connection to endpoint: '/api/student/sessions'
     */
    login = async (credentials) => {
        const url = PREFIX_URL + '/api/student/sessions';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(credentials)
            });
            if (response.ok) {

                /* processing the response */
                const student = await response.json();
                return student;
            } else {

                /* application errors (404, 500, ...) */
                console.log(response.statusText);
                const text = await response.text();
                throw new TypeError(text);
            }
        } catch (error) {
            /* network errors */
            throw error;
        }
    }

    /**
     * Attempts to log the current student 
     * out
     * ====================================
     * 
     * Connection to endpoint: '/api/student/sessions/current'
     */
    logout = async () => {
        const url = PREFIX_URL + '/api/student/sessions/current';
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {

                /* processing the response */
                return null; 
            } else {
                
                /* application errors (404, 500, ...) */
                console.log(response.statusText);
                const text = await response.text();
                throw new TypeError(text);
            }
        } catch (error) {
            /* network errors */
            throw error;
        }
    }

    getStudentInfo = async () => {
        const url = PREFIX_URL + '/api/student/sessions/current';
        try {
            const response = await fetch(url, {
                credentials: 'include'
            });
            
            if (response.ok) {
                /* processing the response */
                const student = await response.json();
                return student;
            } else {
                /* application errors (404, 500, ...) */
                // console.log(response.statusText);
                const text = await response.text();
                throw new TypeError(text);
            }
        } catch (error) {
            /* network errors */
            throw error;
        }
    }

    /**
     * Retrieve the whole list of exams, sorted alphabetically,
     * from the DB.
     * ==========================================================
     * 
     * Connection to endpoint: '/api/exams'
     */
    loadExams = async () => {
        const url = PREFIX_URL + '/api/exams';
        try {
            const response = await fetch(url);
            if (response.ok) {
                /* processing the response */
                const result = await response.json();
                return result; 
            } else {
                /* application errors (404, 500, ...) */
                console.log(response.statusText);
                const text = await response.text();
                throw new TypeError(text);
            }
        } catch (error) {
            /* network errors */
            console.log(error);
            throw error;
        }
    } 

    /**
     * Retrieve the specific exam from the DB given its code.
     * ==========================================================
     * @param {*} code 
     * Connection to endpoint: '/api/exams/:code'
     */
    loadExamByCode = async (code) => {
        const url = PREFIX_URL + '/api/exams/' + code;
        try {
            const response = await fetch(url);
            if (response.ok) {
                /* processing the response */
                const result = await response.json();
                return (result === undefined) ? null : result; 
            } else {
                /* application errors (404, 500, ...) */
                console.log(response.statusText);
                const text = await response.text();
                throw new TypeError(text);
            }
        } catch (error) {
            /* network errors */
            console.log(error);
            throw error;
        }
    }

    /**
     * Retrieve the specific study plan from the DB given the 
     * student code.
     * ==========================================================
     * 
     * Connection to endpoint: '/api/studyplan'
     */
    loadStudyPlan = async () => {
        const url = PREFIX_URL + '/api/studyplan';
        try {
            const response = await fetch(url, {
                credentials: 'include'
            });
            if (response.ok) {
                /* processing the response */
                const result = await response.json();
                return result; 
            } else {
                /* application errors (404, 500, ...) */
                // console.log(response.statusText);
                const text = await response.text();
                throw new TypeError(text);
            }
        } catch (error) {
            /* network errors */
            console.log(error);
            throw error;
        }
    }


    /**
     * Store the given study to from the DB.
     * ========================================
     * 
     * Connection to endpoint: '/api/studyplan'
     */
    storeStudyPlan = async (newStudyPlan) => {
        const url = PREFIX_URL + '/api/studyplan';
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(newStudyPlan)
            });
            if (response.ok) {
                /* processing the response */
                const result = await response.json();
                return result; 
            } else {
                /* application errors (404, 500, ...) */
                // console.log(response.statusText);
                const text = await response.text();
                throw new TypeError(text);
            }
        } catch (error) {
            /* network errors */
            console.log(error);
            throw error;
        }
    }

    /**
     * Delete the study plan of the current logged
     * student.
     * ========================================
     * 
     * Connection to endpoint: '/api/studyplan'
     */
    deleteStudyPlan = async () => {
        const url = PREFIX_URL + '/api/studyplan';
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                /* processing the response */
                const result = response.status;
                return result;
            } else {
                /* application errors (404, 500, ...) */
                // console.log(response.statusText);
                const text = await response.text();
                throw new TypeError(text);
            }
        } catch (error) {
            /* network errors */
            console.log(error);
            throw error;
        }
    }
}

export { API };