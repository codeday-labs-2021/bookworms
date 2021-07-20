import {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

/**
 * Login pop-up
 * 
 */

function Login(props) {

  const [validated, setValidated] = useState(false);

  function handleSubmit(e) {
    const login = e.currentTarget;
    // check for blank fields
    if (login.checkValidity() === false){
        e.stopPropagation();
    } else {
        // setIsPending(true);
    }
    setValidated(true);
    e.preventDefault();
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="login"
      centered
    >
      <Modal.Header>
        <Modal.Title id="login"> Sign in </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control 
              required 
              name="userEmail"
              type="email" 
              placeholder="Enter email"/>
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
              placeholder="Password"/>
            <Form.Control.Feedback type="invalid">
              Please provide your password.
            </Form.Control.Feedback>
          </Form.Group>
                  
          <br/>
                  
          <Form.Group controlId="formCheckBox">
            <Form.Check
              type="checkbox"
              label="Remember me"/>
            <Form.Control.Feedback type="invalid">
              Please provide your thoughts and ideas about the book.
            </Form.Control.Feedback>
          </Form.Group>
                  
          <br/>
          
          <Button type="submit"> Login </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default Login;