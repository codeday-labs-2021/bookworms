import {useState} from 'react';
import {useHistory} from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import "bootstrap/dist/css/bootstrap.min.css";
import styles from './css/create.module.css';

/**
 * The user's create view 
 * 
 */

function Create () {

    /* book review components */
    // const [name, setName] = useState('');
    // const [bookName, setBookName] = useState('');
    // const [review, setReview] = useState('');
    // const [categories, setCategories] = useState('');

    /* other page related components */
    // const [isPending, setIsPending] = useState(false);
    const history = useHistory();
    const [validated, setValidated] = useState(false);

    function handleSubmit(e) {
        const form = e.currentTarget;
        if (form.checkValidity() === false){
            e.preventDefault();
            e.stopPropagation();
        } else {
            e.preventDefault();
            history.push('/');
        }

        setValidated(true);
    }

    return (
        <div className={styles.create}>
            <h2 className={styles.heading}> Add a New Book Review </h2>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group as={Row} controlId="formName">
                    <Form.Label column sm="4" className={styles.label}>Name</Form.Label>
                    <Col sm="8">
                    <Form.Control 
                        required 
                        type="text" 
                        className={styles.inputArea}/>
                    </Col>
                    <Form.Control.Feedback type="invalid">
                        Please provide your name.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Row} controlId="formBookName">
                    <Form.Label column sm="4" className={styles.label}>Book Name</Form.Label>
                    <Col sm="8">
                    <Form.Control 
                        required
                        type="text" 
                        className={styles.inputArea}/>
                    </Col>
                    <Form.Control.Feedback type="invalid">
                        Please provide the book name.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Row} controlId="formReview">
                    <Form.Label column sm="4" className={styles.label}>Book Review</Form.Label>
                    <Col sm="8">
                    <Form.Control 
                        as="textarea" 
                        rows={3} 
                        className={styles.inputArea}
                        required/>
                    </Col>
                    <Form.Control.Feedback type="invalid">
                        Please provide your thoughts and ideas about the book.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Row} controlId="formCategory">
                    <Form.Label column sm="4" className={styles.label}>Book Categories</Form.Label>
                    <Col sm="8">
                    <Form.Control 
                        required
                        type="text" 
                        className={styles.inputArea}/>
                    </Col>
                    <Form.Control.Feedback type="invalid">
                        Please provide the book categories.
                    </Form.Control.Feedback>
                </Form.Group>
                <Button className={styles.submitButton} type="submit"> Submit </Button>
            </Form>
        </div>
        
    );
}

export default Create;