/* --------- IMPORT REACT BOOTSTRAP COMPONENTS --------- */
import { 
    Accordion, 
    Container, 
    Stack, 
    Tooltip, 
    Row,
    Col,
    ListGroup,
    Button,
    OverlayTrigger
} from 'react-bootstrap';

/* --------- IMPORT REACT COMPONENTS --------- */
import { 
    useEffect, 
    useState 
} from 'react';

/**
 * Single exam in the exam list.
 * @param {Object} props 
 * @returns Render this component
 */
function ExamRow (props) {

    /**
     *  + -------------------- +
     *  |   STATES VARIABLES   |
     *  + -------------------- +
    */
    const [preparatoryExam, setPreparatoryExam] = useState(null);   /* store the preparatory exam for the given exam (NB: used for validating the add button) */
    const [incompatibleExams, setIncompatibleExams] = useState(null);   /* store the list of incompatible exams for the given exam (NB: used for validating the add button) */
    const [currentNumberOfStudents, setCurrentNumberOfStudents] = useState(0);  /* store the current number of enrolled students for the given exam (NB: used for validating the add button) */
    const [isAddable, setIsAddable] = useState(false);  /* boolean value indicating if the current exam can be added to the study plan */
    const [loading, setLoading] = useState(false);  /* boolean value indicating if the exam row is ready to be rendered */
    const [tooltipMessage, setTooltipMessage] = useState('');   /* store the message to be rendered when the mouse pointer hovers on the disabled button */

    /* --- ExamRow.js UTILITIES --- */

    /**
     * Return the same exam present in the study plan. Used for checking.
     * ------------------------------------------------------------------
     * @param {Object} exam 
     * @returns The exam corresponding to the given exam in the studyplan
     */
    const retrieveExamFromStudyPlan = (exam) => {
        return props.currentStudyPlan.exams.filter((examInStudyPlan) => examInStudyPlan.code === exam.code)[0]
    }

    /**
     * Check if the given exam can be added to the study plan.
     * Constraints are:
     *      - exam should not be in the study plan yet
     *      - preparatory exam should already be in the study plan
     *      - incompatible exams should not be in the study plan
     *      - exam has not reached full capacity
     * --------------------------------------------------------
     * @param {Object} exam
     * @returns true if the exam can be added to the study plan
     */
    const checkAddable = (exam) => {

        /* exam is already in the study plan */
        if ((retrieveExamFromStudyPlan(exam)) !== undefined) {
            return 'This exam is already in the study plan';
        }

        /* preparatory exam is not in the current study plan */
        if (preparatoryExam !== null) {
            if ((retrieveExamFromStudyPlan(preparatoryExam)) === undefined) {
                return `This exam requires ${preparatoryExam.name} to be in the study plan`;
            }
        }

        /* incompatible exams are in the current study plan */
        if (incompatibleExams !== null) {
            for (let incompatibleExam of incompatibleExams) {
                if ((retrieveExamFromStudyPlan(incompatibleExam)) !== undefined) {
                    return `This exam is incompatible with ${incompatibleExam.name}`;
                }
            }
        }

        /* exam capacity is compatible with current number of enrolled students */
        if (exam.capacity !== null) {
            if (currentNumberOfStudents === exam.capacity) {
                return 'This exam has reached its maximum number of enrolled students';
            }
        }

        return false;
    }

    /**
     * Tooltip to render when the mouse pointer hovers on the disabled button
     * @param {Object} props 
     * @returns Render this tooltip
     */
    const renderTooltip = (props) => {
        if (!isAddable) {
            return <Tooltip id="button-tooltip" {...props}>
                {tooltipMessage}
            </Tooltip>
        } else {
            return <>
            </>
        }
    }


    /**
     *  Retrieve the list of incompatible exams and the preparatory exam
     *  from DB when this component is mounted or the list of exams change
     */
    useEffect(() => {
        setLoading(true);

        /* loading preparatory exam */
        if (props.exam.preparatory !== null) {
            const preparatoryExam = props.exams.filter((exam) => {return exam.code === props.exam.preparatory});
            setPreparatoryExam(preparatoryExam[0]);
        } else {
            setPreparatoryExam(null);
        }

        /* loading incompatible exams */
        if (props.exam.incompatible !== null) {
            const incompatibleExams = [];
            props.exam.incompatible.split('-').forEach((code) => {
                incompatibleExams.push(props.exams.filter((exam) => {return exam.code === code})[0]);
            });
            setIncompatibleExams(incompatibleExams);
        } else {
            setIncompatibleExams(null);
        }

        /* loading current number of students */
        setCurrentNumberOfStudents(props.exam.currentStudentsNumber);

        setLoading(false);
    }, [props.currentStudyPlan, props.exams, props.exam]);


    /**
     * Check if addable when the study plan changes.
     */
    useEffect(() => {
        const message = checkAddable(props.exam);
        if (message) {
            setIsAddable(false);
            setTooltipMessage(message);
        } else {
            setIsAddable(true);
        }
    }, [props.currentStudyPlan]);
    

    /**
     * Rendering component
     */
    return (
        <Accordion.Item eventKey={props.exam.code} >
            {/* ADD BUTTON ONLY IN EDIT MODE */}
            {props.edit &&
                <Container>
                    <Row md={3} className='justify-content-center'>
                        <OverlayTrigger placement="left" delay={{ show: 250, hide: 400 }} overlay={renderTooltip} >
                            <Row>
                                <Button variant={!isAddable ? 'outline-secondary' : 'outline-success'} size='sm' disabled={!isAddable} onClick={() => {props.addExam(props.exam)}}>
                                    Add
                                </Button>
                            </Row>
                        </OverlayTrigger>
                    </Row>
                </Container>
            }
            {/* HEADER OF THE EXAM */}
            <Accordion.Header>
                {props.edit && !isAddable ? 
                    <Stack gap={1} className="col-md-5 mx-auto">
                        <Row className='justify-content-center not-addable'>
                            {props.exam.code}
                        </Row>
                        <Row className='justify-content-center not-addable'>
                            {props.exam.name}
                        </Row>
                        <Row className='justify-content-center not-addable'>
                            Credits: {props.exam.credits}
                        </Row>
                    </Stack> : 
                    <Stack gap={1} className="col-md-5 mx-auto">
                        <b><Row className='justify-content-center'>
                            {props.exam.code}
                        </Row></b>
                        <b><Row className='justify-content-center'>
                            {props.exam.name}
                        </Row></b>
                        <Row className='justify-content-center'>
                            Credits: {props.exam.credits}
                        </Row>
                    </Stack>
                } 
                
            </Accordion.Header>

            {/* BODY OF THE EXAM */}
            <Accordion.Body>

                {/* CURRENT SUBSCRIPTION TO THE COURSE */}
                <Row className="container-fluid">
                    {
                        props.exam.capacity !== null ?
                        <Col>
                            <Row className="justify-content-md-center">
                            {`Maximum number of students: ${props.exam.capacity}`}
                            </Row>
                            <Row className="justify-content-md-center">
                            {`Current number of students: ${currentNumberOfStudents}`}
                            </Row>
                        </Col> :
                        <Row className="justify-content-md-center">
                            {`Current number of students: ${currentNumberOfStudents}`}
                        </Row>
                    }
                </Row>

                <hr />
                {/* DESCRIPTION */}
                <Row>

                    {/* PREPARATORY COURSE */}
                    <Col>
                        <Row className='justify-content-md-center'>
                            Preparatory course (mandatory)
                        </Row>
                        <ListGroup>
                            <ListGroup.Item key={props.exam.code}>
                                {(preparatoryExam !== null && !loading) ? <>
                                    <Row className="justify-content-md-center">
                                        {preparatoryExam.code}
                                    </Row>
                                    <b><Row className="justify-content-center">
                                        {preparatoryExam.name}
                                    </Row></b>    
                                </> : <Row className="justify-content-md-center">None</Row>}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>

                    {/* INCOMPATIBLE COURSES */}
                    <Col>
                        <Row className='justify-content-md-center'>
                            Incompatible courses
                        </Row>
                        <ListGroup>
                            {(incompatibleExams !== null && !loading) ?
                                incompatibleExams.map((exam) => (<ListGroup.Item key={exam.code}>
                                    <Row className="justify-content-md-center">
                                        {exam.code}
                                    </Row>
                                    <b><Row className="justify-content-md-center">
                                        {exam.name}
                                    </Row></b>  
                                </ListGroup.Item>)) :
                                <ListGroup.Item key={'0'}>{'None'}</ListGroup.Item>
                            }
                        </ListGroup>
                    </Col>
                </Row>
            </Accordion.Body>
        </Accordion.Item>
    );
}

/**
 * Single exam in the study plan.
 * @param {Object} props 
 * @returns Render this component
 */
function StudyPlanRow (props) {

    /**
     *  + -------------------- +
     *  |   STATES VARIABLES   |
     *  + -------------------- +
    */
    const [isRemovable, setIsRemovable] = useState(false); /* boolean value indicating if the current exam can be removed from the study plan */
    const [tooltipMessage, setTooltipMessage] = useState(''); /* store the message to be rendered when the mouse pointer hovers on the disabled button */


    /* --- StudyPlanRow.js UTILITIES --- */
    /**
     * Retrieve the exam that corresponds to the preparatory exam of the given exam.
     * ------------------------------------------------------------------
     * @param {Object} exam 
     * @returns The exam corresponding to the preparatory exam in the studyplan
     */
    const retrievePreparatoryExamFromStudyPlan = (exam) => {
        return props.currentStudyPlan.exams.filter((examInStudyPlan) => examInStudyPlan.preparatory === exam.code)[0]
    }

    /**
     * Check if the given exam can be removed from the study plan.
     * Constraints are:
     *      - exam should not be a preparatory (mandatory) exam 
     *        of an exam which is in the study plan
     * --------------------------------------------------------
     * @param {Object} exam
     * @returns true if the exam can be removed from the study plan
     */
    const checkRemovable = (exam) => {
        const constrainedExam = retrievePreparatoryExamFromStudyPlan(exam);
        return (constrainedExam !== undefined) ? `This exam is preparatory for ${constrainedExam.name}` : false;
    }

    /**
     * Tooltip to render when the mouse pointer hovers on the disabled button
     * @param {Object} props 
     * @returns Render this tooltip
     */
    const renderTooltip = (props) => {
        if (!isRemovable) {
            return <Tooltip id="button-tooltip" {...props}>
                {tooltipMessage}
            </Tooltip>
        } else {
            return <>
            </>
        }
    }

    /**
     * Check if removable when the study plan changes
     */
    useEffect(() => {
        if (props.edit) {
            const message = checkRemovable(props.exam);
            if (message) {
                setIsRemovable(false);
                setTooltipMessage(message);
            } else {
                setIsRemovable(true);
            }
        }
    }, [props.currentStudyPlan]);

    /**
     * Rendering component
     */
    return (<ListGroup.Item key={props.exam.code}>
        <b><Row className="justify-content-md-center">
            {props.exam.code}
        </Row></b>
        <Row className="justify-content-md-center">
            {props.exam.name}
        </Row>
        <Row className="justify-content-md-center">
            Credits: {props.exam.credits}
        </Row>
        {props.edit && <Row md='4' className="justify-content-md-center">
            <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltip} >
                <Row>
                    <Button size="sm" variant={!isRemovable ? "outline-secondary" : "outline-danger"} onClick={() => {props.removeExam(props.exam)}} disabled={!isRemovable}>
                        Remove
                    </Button>
                </Row>
            </OverlayTrigger>
        </Row>}
    </ListGroup.Item>);
}

export { ExamRow, StudyPlanRow };