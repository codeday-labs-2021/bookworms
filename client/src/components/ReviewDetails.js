import {useState, useEffect, useCallback} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import styles from '../css/reviewDetails.module.css';

/**
 * Individual review pages
 * 
 */

function ReviewDetails() {

    const [reviewDetails, setReviewDetails] = useState([]);
    const [isPending, setIsPending] = useState(true);

    const {id} = useParams();

    const getDetails = useCallback(async () => {
        const response = await axios.get('https://bookworms-api.vercel.app/api/reviews');
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
    }, [id])

    useEffect(() => getDetails(), [getDetails]);

    return (
        <div>
            {isPending ? "Loading..." :
                <div className={styles.content}>
                    <h1 className={styles.title}> {reviewDetails.book_name} </h1>
                    <h2 className={styles.author}> Published by {reviewDetails.user_name} </h2>
                    <p> {reviewDetails.text} </p>
                    <div className={styles.footer}>
                        <p> {reviewDetails.categories.join(', ')} </p>
                        <p> {reviewDetails.likes} </p>
                    </div>
                </div>
            }
        </div>
    );
}

export default ReviewDetails;