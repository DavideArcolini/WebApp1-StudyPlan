/* ------------ IMPORT REACT-BOOTSTRAP MODULES ------------ */
import { Row }          from 'react-bootstrap';
import { Col }          from 'react-bootstrap';
import { Button }       from 'react-bootstrap';
import { Form }         from 'react-bootstrap';
import { FloatingLabel }from 'react-bootstrap';

/* ------------ IMPORT REACT MODULES ------------ */
import { useState }     from "react";

/* ------------ IMPORT REACT ROUTER MODULES ------------ */
import { useNavigate } from 'react-router-dom';


/**
 * Logout button component
 * ----------------------------------------------------------
 * @param {Object} props list of properties of this component
 * @returns render the logout button
 */
function LogoutButton(props) {
    return(
        <Row>
            <Col>
                <Button size='lg' variant="light" onClick={props.logout}>Logout</Button>
            </Col>
        </Row>
    );
}

/**
 * Login button component
 * ----------------------------------------------------------
 * @param {Object} props list of properties of this component
 * @returns render the login button
 */
 function LoginButton(props) {
    const navigate = useNavigate();
    return(
        <Row>
            <Col>
                <Button size='lg' variant="light" onClick={() => navigate('/login')}>Login</Button>
            </Col>
        </Row>
    );
}

/**
 * Login form component
 * ----------------------------------------------------------
 * @param {Object} props list of properties of this component
 * @returns render the login form
 */
function LoginForm (props) {

    /* --- STATES --- */
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    /**
     * Handle the submit request after fields validations
     * --------------------------------------------------
     */
    const handleSubmit = (event) => {
        event.preventDefault();
        props.login({username, password});
    }

    /* --- RENDER LOGIN FORM --- */
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId='username'>
                <FloatingLabel controlId="floatingUsername" label="username">
                    <Form.Control placeholder="username" type='email' value={username} onChange={ev => setUsername(ev.target.value)} required={true} />
                </FloatingLabel>
            </Form.Group>
            {' '}
            <Form.Group controlId='password'>
                <FloatingLabel controlId="floatingPassword" label="password">
                    <Form.Control placeholder='password' type='password' value={password} onChange={ev => setPassword(ev.target.value)} required={true} minLength={8}/>
                </FloatingLabel>
            </Form.Group>
            <hr />
            <Button type="submit">Login</Button>
      </Form>
    );
}

export { LoginForm };
export { LogoutButton };
export { LoginButton };