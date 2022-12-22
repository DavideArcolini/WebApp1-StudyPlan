/* --------- IMPORT REACT BOOTSTRAP COMPONENTS --------- */
import { 
    Alert, 
    Button, 
    Container, 
    Stack, 
    Row,
    Col
} from 'react-bootstrap';

/* --------- IMPORT CUSTOMIZED COMPONENTS --------- */
import { 
    ExamList 
} from './examList';

import { 
    NavigationBar 
} from './navigationBar';

import { 
    LoginForm 
} from './authentication';

import { 
    StudyPlan, 
    EditableStudyPlan 
} from './studyPlan';

import { 
    Greetings, 
    GreetingsOnLogin,
    GreetingsNewStudyPlan,
    GreetingsNoMatch
} from '../utilities/messages';

/* --------- IMPORT REACT ROUTER COMPONENTS --------- */
import { 
    useNavigate
} from 'react-router-dom';

/**
 * Home Page when the user is not editing the study plan or is not logged in
 * @param {Object} props 
 * @returns Render this component
 */
function HomePage(props) {

    const navigate = useNavigate();

    return (
        <div>

            {/* NAVIGATION BAR */}
            <NavigationBar loggedIn={props.loggedIn} logout={props.logout}/>

            {/* HOME PAGE MESSAGE */}
            <Greetings message={props.message} loggedIn={props.loggedIn}/>

            {/* BODY OF THE HOME PAGE */}
            <Container fluid>
                {props.loggedIn ? 
                    <Row>
                        <Col>
                            <div style={{ borderColor: 'grey', borderWidth: 2, borderStyle: 'dotted', padding: 10 }}>
                                <Container fluid={true}>
                                    <Stack gap={3}>
                                        <Button variant='success'size="lg" onClick={() => {navigate('/study-plan/')}}>
                                            {props.studyPlan.career !== '' ? 'Edit Study Plan' : 'Create Study Plan'}
                                        </Button>
                                        {props.studyPlan.career !== '' && <Button variant='outline-danger' size="lg" onClick={() => {props.deleteStudyPlan(); return navigate('/')}}>
                                            Delete Study Plan
                                        </Button>}
                                        <Row>
                                            {props.studyPlan.career !== '' ? 
                                                <StudyPlan studyPlan={props.studyPlan} /> : 
                                                <Alert>
                                                    <b><Row className="justify-content-md-center">
                                                        Study Plan: empty
                                                    </Row></b>
                                                    <Row className="justify-content-md-center">
                                                        Current number of credits: 0
                                                    </Row>
                                                </Alert> 
                                            }
                                        </Row>
                                    </Stack>
                                </Container>
                            </div>
                        </Col>
                        <Col>
                            <Stack className="col-md-11 mx-auto">
                                <ExamList loggedIn={props.loggedIn} exams={props.exams} currentStudyPlan={props.studyPlan} edit={false}/>
                            </Stack>
                        </Col>
                    </Row> :
                    <Stack className="col-md-7 mx-auto">
                        <ExamList loggedIn={props.loggedIn} exams={props.exams} currentStudyPlan={props.studyPlan} edit={false}/>
                    </Stack>
                }
            </Container>
        </div>
    );
}

/**
 * Login page where the login form is rendered.
 * @param {Object} props 
 * @returns Render this component
 */
function LoginPage(props) {
    return (
        <div>
            {/* NAVIGATION BAR */}
            <div>
                <NavigationBar />
            </div>

            {/* HOME PAGE MESSAGE */}
            <div>
                <GreetingsOnLogin message={props.message}/>
            </div>  

            {/* LOGIN FORM */}
            <div>
                <Row className="justify-content-md-center">
                    <Col md="4" className='text-center'>
                        <LoginForm login={props.login} />
                    </Col>
                </Row>
            </div>
        </div>
    );
}

/**
 * Page when the user is editing the study plan.
 * @param {Object} props 
 * @returns Render this component
 */
function StudyPlanPage(props) {
    return (
        <div>
            {/* NAVIGATION BAR */}
            <div>
                <NavigationBar loggedIn={props.loggedIn} logout={props.logout} />
            </div>

            {/* HOME PAGE MESSAGE */}
            <div>
                <GreetingsNewStudyPlan hasStudyPlan={props.studyPlan.career !== '' ? true : false} />
            </div>  

            {/* NEW STUDY PLAN FORM */}
            <div>  
                <EditableStudyPlan loggedIn={props.loggedIn} exams={props.exams} studyPlan={props.studyPlan} saveStudyPlan={props.saveStudyPlan}/>
            </div>
        </div>
    );
}

/**
 * Page when the user is reaching a non-defined route.
 * @param {Object} props 
 * @returns Render this component
 */
function NoMatchPage(props) {
    return (
        <div>
            {/* NAVIGATION BAR */}
            <div>
                <NavigationBar loggedIn={props.loggedIn} logout={props.logout} />
            </div>

            {/* HOME PAGE MESSAGE */}
            <div>
                <GreetingsNoMatch />
            </div>    

            <div className='justify-content-center' md="10">
                <center>
                    <img src={require('../nomatch.gif')} alt="loading..." width="1000" height='auto' />
                </center>
            </div>
        </div>
    );
}

export { HomePage, LoginPage, StudyPlanPage, NoMatchPage };