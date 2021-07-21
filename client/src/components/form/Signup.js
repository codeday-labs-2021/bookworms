import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function Signup () {
    return (
        <div>
            <h2> Sign up </h2>

            <Form>
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

                <Button type="submit">  Sign up </Button>
            </Form>
        </div>
    )

}

export default Signup;