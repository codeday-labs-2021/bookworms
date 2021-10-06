import {Link} from 'react-router-dom';
import FavIcon from './FavIcon';
import styles from '../css/reviewList.module.css';

/**
 * Generating all reviews in database on homepage
 * @param reviews array of reviews to display
 *  
 */

function ReviewList ({reviews}) {

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
                        <FavIcon reviewId={r.id}/>
                        <p> {r.likes ? (r.likes).length : "0"} </p>
                    </div>
                </div>
            ))}
        </>
    );
}
export default ReviewList;
