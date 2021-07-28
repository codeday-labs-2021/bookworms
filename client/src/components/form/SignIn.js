import {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {Link} from 'react-router-dom';

/**
 * Login pop-up
 * 
 */

function Login(props) {

  // form components
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

  // other page components
  const [validated, setValidated] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function signInUser () {
    const userAccount = {email: userEmail, password: userPassword};
    const response = await fetch('https://bookworms-api.vercel.app/api/signin', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        // convert the React state to JSON and send it as the POST body
        body: JSON.stringify(userAccount)
    })
    // if the request wasn't successful, throw an error for the user to know 
    if (!response.ok) {
        const message = `An error has occured: ${JSON.stringify(await response.json())}`;
        throw new Error(message);
    } else {
        setIsPending(false);
    }
  }

  const handleClose = () => {
    props.onHide();
  }

  const handleChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;

    if (field === 'userEmail') {
        setUserEmail(value);
    } else {
        setUserPassword(value);
    }
  }

  function handleSubmit(e) {
    const signin = e.currentTarget;
    // check for blank fields
    if (signin.checkValidity() === false){
        e.stopPropagation();
    } else {
      setTimeout(() => {
        handleClose();
        signInUser();
      }, 2000);
      setIsPending(true);
    }
    setValidated(true);
    e.preventDefault();
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="signin"
      centered
    >
      <Modal.Header>
        <Modal.Title id="signin"> Sign in </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control 
              required 
              name="userEmail"
              type="email" 
              placeholder="Enter email"
              onChange={handleChange}/>
            <Form.Control.Feedback type="invalid">
              Please provide your email.
            </Form.Control.Feedback>
          </Form.Group>

          <br/>
                  
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              required
              name="userPassword"
              type="password"
              placeholder="Password"
              onChange={handleChange}/>
            <Form.Control.Feedback type="invalid">
              Please provide your password.
            </Form.Control.Feedback>
          </Form.Group>
                  
          <br/>
                  
          <Form.Group controlId="formCheckBox">
            <Form.Check
              type="checkbox"
              label="Remember me"/>
          </Form.Group>

          <br/>             

          <Button type="submit" disabled={isPending}>  {isPending ? 'Signing in...' : 'Sign in'} </Button>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Link to="/signup" onClick={handleClose}> Not a registered user? </Link>
      </Modal.Footer>
    </Modal>
  );
}

export default Login;