/* --------- IMPORTING REACT BOOTSTRAP COMPONENTS --------- */
import { 
    Button, 
    Container, 
    ListGroup, 
    Stack,
    Col,
    Row,
    Alert,
    Tooltip,
    OverlayTrigger 
} from "react-bootstrap";

/* --------- IMPORTING REACT COMPONENTS --------- */
import { 
    useEffect, 
    useState 
} from "react";

/* --------- IMPORTING REACT ROUTER COMPONENTS --------- */
import { useNavigate }  from "react-router-dom";

/* --------- IMPORTING CUSTOMIZED COMPONENTS --------- */
import { ExamList }     from "./examList";
import { StudyPlanRow } from "./examRow";

/**
 * List of exam in the study plan of the student.
 * @param {Object} props 
 * @returns Render this component
 */
function StudyPlan (props) {

    /**
     * Render component
     */
    return <Container> {
        props.studyPlan.career !== '' ? 
        <Row>
            <Container>
                <Row className="justify-content-md-center">
                    <Alert variant="success">
                        <b><Row className="justify-content-md-center">
                            Study Plan: {props.studyPlan.career}
                        </Row></b>
                        <Row className="justify-content-md-center">
                            Current number of credits: {props.studyPlan.credits}
                        </Row>
                    </Alert>
                </Row>
                <Row>
                    <ListGroup>
                        {props.studyPlan.exams.map((exam) => (
                            <StudyPlanRow 
                                exam={exam}
                                key={exam.code} 
                                edit={false}
                            />
                        ))}
                    </ListGroup>
                </Row>
            </Container>
        </Row> :
        <></>
    }</Container>;
}

/**
 * Same as StudyPlan, but editable so that user can add or remove exams.
 * @param {Object} props 
 * @returns Render this component
 */
function EditableStudyPlan (props) {

    /* --- UTILITIES MESSAGE WHEN SELECTING THE STUDY OPTION --- */
    const FullTimeInfo = <Container>
        <b><Row className="justify-content-md-center">
            FULL-TIME CAREER
        </Row></b>
        <Row className="justify-content-md-center">
            A Full-Time career requires the student a greater effort.
        </Row>
        <Row className="justify-content-md-center">
            In particular, the total amount of credits computed by summing up the credits of all chosen exams can range from 60 to 80.
        </Row>
    </Container>;
    const PartTimeInfo = <Container>
        <b><Row className="justify-content-md-center">
            PART-TIME CAREER
        </Row></b>
        <Row className="justify-content-md-center">
            A Part-Time career requires the student a lighter effort.
        </Row>
        <Row className="justify-content-md-center">
            In particular, the total amount of credits computed by summing up the credits of all chosen exams can range from 20 to 40.
        </Row>
    </Container>;



    /**
     *  + -------------------- +
     *  |   STATES VARIABLES   |
     *  + -------------------- +
    */
    const [careerInfo, setCareerInfo] = useState('');   /* store the current type of career the user has chosen */
    const [currentStudyPlan, setCurrentStudyPlan] = useState({career: '', exams: [], credits: 0});  /* store the current study plan of the user, after each modifications */
    const [currentStudyPlanIsValid, setCurrentStudyPlanIsValid] = useState(false);  /* store a boolean value indicating if the study plan is valid or not */

    /* --- UTILITIES FUNCTIONS --- */
    const navigate = useNavigate();

    /**
     * Add the given exam to the current study plan, computing the new number of credits
     * @param {Object} exam 
     */
    const addExam = async (exam) => {
        setCurrentStudyPlan({
            career: currentStudyPlan.career,
            exams: [...currentStudyPlan.exams, exam],
            credits: currentStudyPlan.credits + exam.credits
        });
    }

    /**
     * Remove the given exam from the current study plan, computing the new number of credits
     * @param {Object} exam 
     */
    const removeExam = (exam) => {
        setCurrentStudyPlan({
            career: currentStudyPlan.career,
            exams: currentStudyPlan.exams.filter((element, index) => index !== currentStudyPlan.exams.indexOf(exam)),
            credits: currentStudyPlan.credits - exam.credits
        });
    }

    /**
     * Check if the current study plan (either after the first uploaded or every time it changes) is 
     * valid due to the credits constraints.
     * 
     * NB: exams constraints are not checked here, because user is not able to add an exam to or remove
     *     an exam from the study plan if it does not satisfy the specific constraints.
     */
    const checkValidity = () => {

        if (currentStudyPlan.career === 'Full Time') {
            setCurrentStudyPlanIsValid((currentStudyPlan.credits >= 60 && currentStudyPlan.credits <= 80));
        } else if (currentStudyPlan.career === 'Part Time') {
            setCurrentStudyPlanIsValid((currentStudyPlan.credits >= 20 && currentStudyPlan.credits <= 40));
        }
    }

    /**
     * Render the tooltip when the exam cannot be removed
     * @param {Object} props 
     * @returns Tooltip
     */
    const renderTooltipChanges = (props) => {
        if (currentStudyPlan.credits <= (currentStudyPlan.career === 'Full Time' ? 60 : 20)) {
            return <Tooltip id="button-tooltip" {...props}>
                {`You still need at least ${(currentStudyPlan.career === 'Full Time' ? 60 : 20) - currentStudyPlan.credits} credits.`}
            </Tooltip>
        } else if (currentStudyPlan.credits >= (currentStudyPlan.career === 'Full Time' ? 80 : 40)) {
            return <Tooltip id="button-tooltip" {...props}>
                {`You need to remove at least ${currentStudyPlan.credits - (currentStudyPlan.career === 'Full Time' ? 80 : 40)} credits.`}
            </Tooltip>
        } else {
            return <></>
        }
        
    }

    /**
     * We need to check the validity of the current study plan every time it is modified (also, when it is
     * first mounted)
     */
    useEffect(() => {
        checkValidity();
    }, [currentStudyPlan]);

    /**
     * When this component is first mounted, we are going to set the current study plan to the
     * one retrieved by the App (either an empty study plan or a study plan fetched from the DB and
     * therefore valid)
     */
    useEffect(() => {
        setCurrentStudyPlan(props.studyPlan);
    }, []);


    /**
     * Rendering component
     * 
     * NB: if the current study plan does not have a career specified, it means it needs to be first created. Therefore
     *     the user will be given the possibility to choose between the two available careers and then edit the study plan
     */
    if (currentStudyPlan.career !== '') {

        /**
         *              CURRENT USER DOES HAVE A STUDY PLAN
         * ---------------------------------------------------------------------------
         * The user can edit its study plan in accordion with the constraints specified
         * by the university.
         * 
         * The study plan will be temporary stored in the corresponding state of this
         * component and it will be dynamically evaluated. Only a valid study plan can
         * be submitted at the end of the operations.
        */
        return <Container>
            <Row>
                {/* LEFT COLUMN: STUDY-PLAN */}
                <Col>
                    <div style={{ borderColor: 'grey', borderWidth: 2, borderStyle: 'dotted', padding: 10 }}>
                        <Container>
                            <Row className="justify-content-md-center">
                                <Alert variant="">
                                    <Stack gap={2} className="col-md-5 mx-auto">
                                        <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltipChanges} >
                                            <Row>
                                                <Button disabled={!currentStudyPlanIsValid} variant={currentStudyPlanIsValid ? 'success' : 'outline-danger'} onClick={() => {props.saveStudyPlan(currentStudyPlan); return navigate('/')}}>
                                                    Save changes
                                                </Button>
                                            </Row>
                                        </OverlayTrigger>
                                        <Row>
                                            <Button variant="outline-secondary" onClick={() => {navigate('/');}}>Cancel</Button>
                                        </Row>
                                    </Stack>
                                </Alert>
                            </Row>
                            <Row className="justify-content-md-center">
                                <Alert variant="success">
                                    <b><Row className="justify-content-md-center">
                                        Study Plan: {currentStudyPlan.career}
                                    </Row></b>
                                    <Row className="justify-content-md-center">
                                        Current number of credits: {currentStudyPlan.credits}
                                    </Row>
                                    <Row className="justify-content-md-center">
                                        Required number of credits: {currentStudyPlan.career === 'Full Time' ? '60 - 80' : '20 - 40'}
                                    </Row>
                                </Alert>
                            </Row>
                            <Row>
                                <ListGroup>
                                    {currentStudyPlan.exams.map((exam) => (
                                        <StudyPlanRow 
                                            exam={exam}
                                            key={exam.code} 
                                            currentStudyPlan={currentStudyPlan}
                                            removeExam={removeExam}
                                            edit={true}
                                        />
                                    ))}
                                </ListGroup>
                            </Row>
                        </Container>
                    </div>
                </Col>

                {/* RIGHT COLUMN: WHOLE LIST OF EXAMS */}
                <Col>
                    <ExamList loggedIn={props.loggedIn} exams={props.exams} currentStudyPlan={currentStudyPlan} addExam={addExam} edit={true}/>
                </Col>
            </Row>
        </Container>
    } else {

        /**
         *              CURRENT USER DOES NOT HAVE A STUDY PLAN YET
         * ---------------------------------------------------------------------------
         * The user, before editing its study plan, must choose a career type between:
         * 
         *      - Full-Time
         *      - Part-Time
         * 
         * Then, the career type will temporary saved in this state's component until
         * the user create a VALID study plan and click the SAVE button. This operation
         * will result in a POST to the DB where the study plan will be saved permanently.
        */
        return <Container fluid={true}>
            <Stack gap={3} className="col-md-5 mx-auto">
                <Button variant="outline-primary" size= "lg" onClick={() => {setCurrentStudyPlan({career: 'Full Time', exams: [], credits: 0})}} onMouseEnter={() =>{setCareerInfo(FullTimeInfo)}} onMouseLeave={() => {setCareerInfo('')}}>
                    Full-Time
                </Button>
                <Button variant="outline-primary" size="lg" onClick={() => {setCurrentStudyPlan({career: 'Part Time', exams: [], credits: 0})}} onMouseEnter={() =>{setCareerInfo(PartTimeInfo)}} onMouseLeave={() => {setCareerInfo('')}}>
                    Part-Time
                </Button>
                {careerInfo !== '' ?
                <div style={{borderColor: 'grey', borderWidth: 2, borderStyle: 'dotted', padding: 10 }}>
                    {careerInfo}
                </div> :
                <></>
            }
            </Stack>
        </Container>
    }
}  

export { StudyPlan, EditableStudyPlan }