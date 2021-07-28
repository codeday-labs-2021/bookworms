import logo from '../../logo192.png';
import {useState} from 'react';
import {useHistory, Link} from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import SubmitButton from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {makeStyles} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import MediaLogo from '@material-ui/core/Button';
import FacebookIcon from '@material-ui/icons/Facebook';
import MailIcon from '@material-ui/icons/Mail';
import TwitterIcon from '@material-ui/icons/Twitter';
import styles from '../../css/signUp.module.css';


// media tabs
const useStyles = makeStyles ({
    gmail: {
        backgroundColor: '#db4437',
        '&:hover': {
            backgroundColor: '#e2695f',
        }
    },

    fb: {
        backgroundColor: '#4267b2',
        '&:hover': {
            backgroundColor:  '#6785c1',
        }
    },

    twitter: {
        backgroundColor: '#00acee',
        '&:hover': {
            backgroundColor: '#33bcf1',
        }
    }
})

/**
 * Sign-up view for users
 * 
 */

function Signup () {

    // css for medias
    const classes = useStyles();

    // form components 
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // other page components 
    const [validated, setValidated] = useState(false);
    const history = useHistory();
    const [isPending, setIsPending] = useState(false);

    // reset form after each new user submitted 
    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
    }

    async function addNewUser () {
        const newUser = {name, email, password};
        const response = await fetch('https://bookworms-api.vercel.app/api/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            // convert the React state to JSON and send it as the POST body
            body: JSON.stringify(newUser)
        })
        // if the request wasn't successful, throw an error for the user to know 
        if (!response.ok) {
            const message = `An error has occured: ${JSON.stringify(await response.json())}`;
            throw new Error(message);
        } else {
            setIsPending(false);
            resetForm();
        }
    }

    const handleChange = (e) => {
        const field = e.target.name;
        const value = e.target.value;

        if (field === 'userName') {    
            setName(value);
        } else if (field === 'userEmail') {
            setEmail(value);
        } else {
            setPassword(value);
        }
    }

    function handleSubmit(e) {
        const signup = e.currentTarget;
        // check for blank fields
        if (signup.checkValidity() === false){
            e.stopPropagation();
        } else {
            setIsPending(true);
            setTimeout(() => {
                addNewUser();
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
                    <Form.Group controlId="formName" className={styles.field}>
                        <Form.Control 
                            required 
                            name="userName"
                            type="text" 
                            placeholder="Your Name"
                            onChange={handleChange}/>
                        <Form.Control.Feedback type="invalid" className={styles.feedback}>
                            Please provide your name.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formEmail" className={styles.field}>
                        <Form.Control 
                            required 
                            name="userEmail"
                            type="email" 
                            placeholder="Email"
                            onChange={handleChange}/>
                        <Form.Control.Feedback type="invalid" className={styles.feedback}>
                            Please provide your email.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formPassword" className={styles.field}>
                        <Form.Control 
                            required
                            name="userPassword"
                            type="password"
                            placeholder="Password"
                            onChange={handleChange}/>
                        <Form.Control.Feedback type="invalid" className={styles.feedback}>
                            Please provide your password.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <SubmitButton className={styles.signupButton} disabled={isPending} type="submit"> {isPending ? 'Registering...' : 'Sign up'} </SubmitButton>
                </Form>
                
                <Container>
                    <Row className={styles.divider}>
                        <Col>
                            <Divider component="h1"/>
                        </Col>
                        <Col>
                            <Typography variant="overline" align="center"> OR </Typography>
                        </Col>
                        <Col>
                            <Divider component="h1"/>
                        </Col>
                    </Row>
                </Container>

                <Container>
                    Sign in with:
                    <Row className={styles.media}>
                        <MediaLogo 
                            variant="contained"
                            startIcon={<MailIcon />}
                            className={classes.gmail}
                            disableRipple
                        > Gmail 
                        </MediaLogo>
                    </Row>
                    <Row className={styles.media}>
                        <MediaLogo 
                            variant="contained"
                            startIcon={<FacebookIcon />}
                            className={classes.fb}
                            disableRipple
                        > Facebook 
                        </MediaLogo>
                    </Row>
                    <Row className={styles.media}>
                        <MediaLogo 
                            variant="contained"
                            startIcon={<TwitterIcon />}
                            className={classes.twitter}
                            disableRipple
                        > Twitter 
                        </MediaLogo>
                    </Row>
                </Container>
            </div>
        </div>
    )

}

export default Signup;