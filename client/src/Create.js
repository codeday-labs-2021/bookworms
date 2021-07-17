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
    const [user_name, setUserName] = useState('');
    const [book_name, setBookName] = useState('');
    const [text, setReview] = useState('');
    const [categories, setCategories] = useState([]);

    /* other page related components */
    const [isPending, setIsPending] = useState(false);
    const history = useHistory();
    const [validated, setValidated] = useState(false);


    const handleChange = (e) => {
        let field = e.target.name;
        let value = e.target.value;

        if (field === 'user') {
            setUserName(value);
        } else if (field === 'book') {
            setBookName(value);
        } else if (field === 'review') {
            setReview(value);
        } else {
            const categoryArray = value.split(",");
            setCategories(categoryArray);
        }
    }

    async function createReview () {
        const newReview = {user_name, book_name, text, categories};
        const response = await fetch('https://bookworms-api.vercel.app/api/reviews', {
            method: 'POST',
            // convert the React state to JSON and send it as the POST body
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newReview)
        })
        // if the request wasn't succesful, throw an error for the user to know 
        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        } else {
            setIsPending(false);
        }
    }

    function handleSubmit(e) {
        const form = e.currentTarget;
        // check for blank fields
        if (form.checkValidity() === false){
            e.stopPropagation();
        } else {
            setIsPending(true);
            // slow down the switching back to home page for a little
            setTimeout(() => {
                createReview();
                history.push('/');
            }, 2000);
        }
        setValidated(true);
        e.preventDefault();
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
                        name="user"
                        type="text" 
                        value={user_name}
                        className={styles.inputArea}
                        onChange={handleChange}/>
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
                        name="book"
                        type="text" 
                        value={book_name}
                        className={styles.inputArea}
                        onChange={handleChange}/>
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
                        required
                        name="review"
                        value={text}
                        onChange={handleChange}/>
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
                        name="category"
                        type="text" 
                        className={styles.inputArea}
                        value={categories}
                        onChange={handleChange}/>
                    </Col>
                    <Form.Control.Feedback type="invalid">
                        Please provide the book categories.
                    </Form.Control.Feedback>
                </Form.Group>
                <Button className={styles.submitButton} disabled={isPending} type="submit"> {isPending ? 'Adding...' : 'Submit'} </Button>
            </Form>
        </div>
        
    );
}

export default Create;