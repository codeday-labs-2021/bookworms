import logo from '../../logo192.png';
import {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from '../../css/signIn.module.css';

/**
 * Sign in page
 * 
 */

function Signin() {

  // form components
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

  // other page components
  const [validated, setValidated] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const history = useHistory();

  async function signInUser () {
    const userAccount = {email: userEmail, password: userPassword};
    const response = await fetch('https://bookworms-api.vercel.app/api/signin', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        // convert the React state to JSON and send it as the POST body
        body: JSON.stringify(userAccount),
        credentials: 'include',
    })
    // if the request wasn't successful, throw an error for the user to know 
    if (!response.ok) {
        const message = `An error has occured: ${JSON.stringify(await response.json())}`;
        throw new Error(message);
    } else {
        setIsPending(false);
        history.push('/home');
    }
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
      setIsPending(true);
      setTimeout(() => {
        signInUser();
      }, 2000);
    }
    setValidated(true);
    e.preventDefault();
  }

  return (
    <Container className={styles.container}>
      <Row>
        <Col className={styles.description}>
          <div className={styles.logo}>
              <img src={logo} height={80} width={80} alt="logo"/> 
              <Link to="/"> <h1 className={styles.name}>bookworms</h1> </Link>
          </div>
          <br/>
          <h4> <span className={styles.name}> bookworms </span> is a CodeDay Labs project to create a web app to share your ideas of a book with others. </h4>
        </Col>

        <Col>
          <Form noValidate validated={validated} onSubmit={handleSubmit} className={styles.form}>
            <Form.Group className={styles.field}>
              <FloatingLabel controlId="formEmail" label="Email address">
                <Form.Control 
                  required 
                  name="userEmail"
                  type="email" 
                  placeholder="Enter email"
                  onChange={handleChange}/>
                <Form.Control.Feedback type="invalid">
                  Please provide your email.
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
                            
            <Form.Group className={styles.field}>
              <FloatingLabel controlId="formPassword" label="Password">
                <Form.Control 
                  required
                  name="userPassword"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}/>
                <Form.Control.Feedback type="invalid">
                  Please provide your password.
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
                                                  
            <Form.Group controlId="formCheckBox" className={styles.field}>
              <Form.Check
                type="checkbox"
                label="Remember me"/>
            </Form.Group>
            <Button className={styles.signinButton} disabled={isPending} type="submit"> {isPending ? 'Signing in...' : 'Sign in'} </Button>
            <p className={styles.newUser}> Don't have an account? <Link to="/signup"> Sign up </Link> </p>
          </Form>            
        </Col>
      </Row>
    </Container>
  );
}

export default Signin;