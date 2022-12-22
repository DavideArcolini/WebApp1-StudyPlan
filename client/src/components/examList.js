/* --------- IMPORT REACT BOOTSTRAP COMPONENTS --------- */
import { Accordion } from 'react-bootstrap';

/* --------- IMPORT CUSTOMIZED COMPONENTS --------- */
import { ExamRow } from './examRow';

/**
 * List of the exams in the DB.
 * @param {Object} props 
 * @returns Render this component
 */
function ExamList (props) {

    return (
        <Accordion alwaysOpen>
            {props.exams.map((exam) => (
                <ExamRow 
                    loggedIn={props.loggedIn} 
                    exams={props.exams} 
                    key={exam.code} 
                    exam={exam} 
                    edit={props.edit}
                    addExam={props.addExam}
                    currentStudyPlan={props.currentStudyPlan}
                    
                />))
            }
        </Accordion>
    );

}

export { ExamList };