/* --------- IMPORTING BOOTSTRAP CSS --------- */
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

/* --------- IMPORT REACT ROUTE COMPONENT --------- */
import {
    BrowserRouter,
    Navigate,
    Routes,
    Route
} from 'react-router-dom';

/* --------- IMPORT REACT COMPONENT --------- */
import { 
    useEffect, 
    useState 
} from 'react';

/* --------- IMPORTING CUSTOMIZED COMPONENT --------- */
import { 
    HomePage,
    LoginPage,
    StudyPlanPage,
    NoMatchPage
} from './components/mainPages';

/* --------- IMPORTING API COMPONENT --------- */
import { 
    API 
} from "./utilities/API";

function App() {

    /**
     *  + -------------------- +
     *  |   STATES VARIABLES   |
     *  + -------------------- +
    */
    const [loggedIn, setLoggedIn] = useState(false);                                    /* Current user is logged in --> default: false                                 */
    const [message, setMessage] = useState({content: 'Welcome', type: 'primary'});      /* Current message displayed in the greeting component --> default: "Welcome"   */
    const [exams, setExams] = useState([]);                                             /* List of all available exams. It is loaded when this component is mounted     */
    const [studyPlan, setStudyPlan] = useState({career: '', exams: [], credits: 0});    /* Study plan of the current user. It is loaded when the user log in            */
    
    
    /* --- APP.js UTILITIES --- */
    const frontAPI = new API();

    /**
     * Load the whole list of exams from the DB to this
     * state's component.
     */
    const loadExams = async () => {
        try {
            const result = await frontAPI.loadExams();
            setExams(result);
        } catch (error) {
            console.log(error);
            alert(error);  
        }
    }

    /**
     * Load the study plan of the current logged student from the DB
     * to this state's component.
     * @param {String} career 
     */
    const loadStudyPlan = async (career) => {
        try {
            const result = await frontAPI.loadStudyPlan();
            setStudyPlan({
                career: career,
                exams: result.exams,
                credits: result.credits
            });
        } catch (error) {
            console.log(error);
            alert(error);
        }
    }


    /**
     * Store the given study plan in the DB.
     * @param {Object} currentStudyPlan 
     */
    const handleSaveStudyPlan = async (currentStudyPlan) => {
        try {
            await frontAPI.storeStudyPlan(currentStudyPlan);
            loadExams();
            checkAuth();
        } catch (error) {
            console.log(error);
            alert(error);
        }
    }

    /**
     * Remove the study plan of the current logged student 
     * from the DB.
     */
    const handleDeleteStudyPlan = async () => {
        try {
            await frontAPI.deleteStudyPlan();
            loadExams();
            checkAuth();
        } catch (error) {
            console.log(error);
            alert(error);
        }
    }

    /**
     * Manage the login of a user
     * Performs the following operations: 
     *    - call the frontAPI to fetch the server-side endpoint implementing the login request
     *    - check for errors
     *    - actual update of the states
     */
    const handleLogin = async (credentials) => {
        try {
            const student = await frontAPI.login(credentials);
            setLoggedIn(true);
            if (student.career !== null) {
                loadStudyPlan(student.career);
            }
            setMessage({
                content: `Welcome, ${student.name}`,
                type: 'success'
            });
        } catch (error) {
            console.log(error);
            setMessage({
                content: 'Wrong username or password',
                type: 'danger'
            });
        }
    }

    /**
     * Manage the logout of a user
     * Performs the following operations: 
     *    - call the frontAPI to fetch the server-side endpoint implementing the logout request
     *    - check for errors
     *    - actual update of the states
     */
    const handleLogout = async () => {
        try {
            await frontAPI.logout();
            setLoggedIn(false);
            setStudyPlan({career: '', exams: [], credits: 0});
            setMessage({content: 'Welcome'});
        } catch (error) {
            console.log(error);
            alert(error);
        }
    }

    /**
     * Retrieve the current student (user) info to check if the current
     * user is authenticated or not.
     */
    const checkAuth = async () => {
        try {
            const student = await frontAPI.getStudentInfo();
            setLoggedIn(true);
            if (student.career !== null) {
                loadStudyPlan(student.career);
            } else {
                setStudyPlan({
                    career: '',
                    exams: [],
                    credits: 0
                })
            }
            setMessage({
                content: `Welcome, ${student.name}`,
                type: 'success'
            });
        } catch (error) {
            /**
             * DO NOTHING
             * ----------
             * student is simply not logged in, no problem
             */
        }
    }


    /**
     * When the component is first mounted:
     * 
     *  - load the content of the exams table from the DB to this component's state. 
     *    This is due to the fact that the whole list of exams need to be showed also to 
     *    the (unauthenticated) user in the home page.
     * 
     *  - check if this current session is already authenticated in order to load also 
     *    the studyPlan (if it exists)
     */
    useEffect(() => {
        loadExams();    /* load the list of exams (NB: it happens only here and when a student delete or save a new study plan in the DB) */
        checkAuth();    /* check if the user is authenticated (NB: used mainly to keep user logged after refresh) */
    }, []);

    /**
     *  Rendering Web Application
     */
    return ( <>

        <BrowserRouter>
            <Routes>

                {/* --- ROOT --- */}
                <Route path='/' element = {<HomePage loggedIn={loggedIn} message={message} logout={handleLogout} deleteStudyPlan={handleDeleteStudyPlan} exams={exams} studyPlan={studyPlan}/>} />

                {/* --- LOGIN --- */}
                <Route path='/login' element = {
                    loggedIn ? <Navigate replace to='/' /> : <LoginPage login={handleLogin} message={message}/>
                } />

                {/* --- STUDY-PLAN --- */}
                <Route path='/study-plan/' element = {
                    loggedIn ? <StudyPlanPage loggedIn={loggedIn} logout={handleLogout} exams={exams} studyPlan={studyPlan} saveStudyPlan={handleSaveStudyPlan} /> : <Navigate replace to='/login' />
                } />

                {/* --- PAGE NOT FOUND --- */}
                <Route path='*' element={<NoMatchPage loggedIn={loggedIn} logout={handleLogout}/>} />         
            </Routes>
        </BrowserRouter>
    </>);
}

export default App;
