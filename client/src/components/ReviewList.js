// import {useState} from 'react';
import {Link} from 'react-router-dom';
import FavIcon from './FavIcon';
import styles from '../css/reviewList.module.css';

function ReviewList ({reviews}) {

    // const [reviewId, setReviewId] = useState('');

    // const toggleFav = (id) => {
    //     setReviewId(id);
    //     updateFav();
    // }

    // async function updateFav(){
    //     const response = await fetch('https://bookworms-api.vercel.app/api/like', {
    //         method: 'POST',
    //         headers: {'Content-Type': 'application/json'},
    //         // convert the React state to JSON and send it as the POST body
    //         body: JSON.stringify({review_id: reviewId})
    //     })
    //     // if the request wasn't successful, throw an error for the user to know 
    //     if (!response.ok) {
    //         const message = `An error has occured: ${response.status}`;
    //         throw new Error(message);
    //     } else {
    //         console.log("fav updated");
    //     }
    // }

    return (
        <>
            {reviews.map((r) => (
                <div className={styles.review} key={r.id}>
                    <Link to={`/reviews/${r.id}`}>
                        <h1 className={styles.title}> {r.book_name} </h1>
                        {/* <h2 className={styles.author}> Published by {r.user_name} </h2> */}
                        <span className={styles.reviewText}> 
                            <p> {r.text} </p>
                        </span>
                    </Link>
                    <div className={styles.footer}>
                        <p> {r.categories.join(', ')} </p>
                        <FavIcon/>
                            {/* onClick={toggleFav(r.id)}/> */}
                        <p> {(r.likes)} </p>
                    </div>
                </div>
            ))}
        </>
    );
}

export default ReviewList;
