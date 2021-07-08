// import {useState} from 'react';
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {useHistory} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

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

    function handleSubmit(e) {
        e.preventDefault();
        // setIsPending(true);

        // setIsPending(false);
        history.push('/');
    }

    return (
        <div className="create">
            <h2> Add a New Book Review </h2>

            <Form>
                <Form.Group as={Row} controlId="formName">
                    <Form.Label column sm="4">Name</Form.Label>
                    <Col sm="8">
                    <Form.Control type="text" />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formBookName">
                    <Form.Label column sm="4">Book Name</Form.Label>
                    <Col sm="8">
                    <Form.Control type="text" />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formReview">
                    <Form.Label column sm="4">Book Review</Form.Label>
                    <Col sm="8">
                    <Form.Control as="textarea" rows={3} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formCategory">
                    <Form.Label column sm="4">Book Categories</Form.Label>
                    <Col sm="8">
                    <Form.Control type="text" />
                    </Col>
                </Form.Group>

            </Form>

            <button onClick={handleSubmit}> Submit </button>
        </div>
        
    );
}

export default Create;