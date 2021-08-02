import {useState, useEffect, useCallback} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover';
import Snackbar from '@material-ui/core/Snackbar';
import DeleteButton from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import styles from '../css/reviewDetails.module.css';

/**
 * Individual review pages
 * 
 */

function ReviewDetails() {

    const [reviewDetails, setReviewDetails] = useState([]);
    const [isPending, setIsPending] = useState(true);

    const [showAlert, setShowAlert] = useState(false);
    const [error, setError] = useState('');

    const {id} = useParams();
    const history = useHistory();

    // handle delete 
    async function handleDelete (reviewId) {
        const response = await fetch('https://bookworms-api.vercel.app/api/reviews/'+ reviewId, {
            method: 'DELETE',
            credentials: 'include',
        });
        const feedback = await response.json();
        if (!feedback.success) {
            setError(feedback.message);
            setShowAlert(true);
        } else {
            history.push("/home");
        }
    }

    // pop up for more actions 
    const popOver = (
        <Popover id="popover-basic">
            <Popover.Body>
                <DeleteButton 
                    className={styles.delete} 
                    endIcon={<DeleteIcon/>}
                    onClick={() => handleDelete(id)}
                > Delete 
                </DeleteButton>
            </Popover.Body>
      </Popover>    
    );

    // get all details of a review
    const getDetails = useCallback(async () => {
        const response = await axios.get('https://bookworms-api.vercel.app/api/reviews');
        if (!response.data.success) {
            const message = 'An error has occured';
            throw new Error(message);
        } else {
            const reviewsArray = response.data.data;
            var details = [];
                for (var i = 0; i < reviewsArray.length; i++){
                    if (reviewsArray[i].id === id){
                        details = (reviewsArray[i]);
                        break;
                    }
                }
            setReviewDetails(details);
            setIsPending(false);
        }
    }, [id])

    useEffect(() => getDetails(), [getDetails]);

    return (
        <>
            <>
                {error ? <Snackbar 
                    open={showAlert} 
                    anchorOrigin={{vertical:'top', horizontal:'center'}} 
                    autoHideDuration = {3000}
                    message={error} 
                    action={<Icon color="primary" onClick={() => setShowAlert(false)}>close</Icon>}
                    /> : ""}
            </>
            {isPending ? "Loading..." :
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h1 className={styles.title}> {reviewDetails.book_name} </h1>
                        <OverlayTrigger trigger="click" placement="bottom" overlay={popOver}>
                            <Icon color="primary" fontSize="large" className={styles.more}>more_horiz</Icon>
                        </OverlayTrigger>
                    </div>
                    {/* <h2 className={styles.author}> Published by {reviewDetails.user_name} </h2> */}
                    <p> {reviewDetails.text} </p>
                    <div className={styles.footer}>
                        <p> {reviewDetails.categories.join(', ')} </p>
                        <p> {reviewDetails.likes} </p>
                    </div>
                </div>
            }
        </>
    );
}

export default ReviewDetails;