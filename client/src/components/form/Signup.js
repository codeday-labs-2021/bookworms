import logo from '../../logo192.png';
import {useState} from 'react';
import {useHistory, Link} from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import FacebookIcon from '@material-ui/icons/Facebook';
import MailIcon from '@material-ui/icons/Mail';
import TwitterIcon from '@material-ui/icons/Twitter';
import styles from '../../css/signUp.module.css';

function Signup () {

    const [validated, setValidated] = useState(false);
    const history = useHistory();

    function handleSubmit(e) {
        const signup = e.currentTarget;
        // check for blank fields
        if (signup.checkValidity() === false){
            e.stopPropagation();
        } else {
          setTimeout(() => {
            history.push('/');
          }, 2000);
        }
        setValidated(true);
        e.preventDefault();
    }
    
    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <Link to="/"> <img src={logo} height={100} width={100} alt="logo"/> </Link>
            </div>
            <div className={styles.content}>
                <Form noValidate validated={validated} className={styles.form} onSubmit={handleSubmit}>
                    <Form.Group controlId="formEmail" className={styles.field}>
                        <Form.Control 
                            required 
                            name="userEmail"
                            type="email" 
                            placeholder="Email"/>
                        <Form.Control.Feedback type="invalid" className={styles.feedback}>
                            Please provide your email.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formPassword" className={styles.field}>
                        <Form.Control 
                            required
                            name="userPassword"
                            type="password"
                            placeholder="Password"/>
                        <Form.Control.Feedback type="invalid" className={styles.feedback}>
                            Please provide your password.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button className={styles.signupButton} type="submit">  Sign up </Button>
                </Form>
                
                <Container>
                    <Row className={styles.divider}>
                        <Col>
                            <Divider component="h1" paragraph/>
                        </Col>
                        <Col>
                            <Typography variant="overline" align="center"> OR </Typography>
                        </Col>
                        <Col>
                            <Divider component="h1" paragraph/>
                        </Col>
                    </Row>
                </Container>

                <Container>
                    Sign in with:
                    <Row className={styles.media}>
                        <Col>
                            <MailIcon />
                        </Col>
                        <Col>
                            <FacebookIcon />
                        </Col>
                        <Col>
                            <TwitterIcon />
                        </Col>
                    </Row>
                </Container>

            </div>
        </div>
    )

}

export default Signup;