import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite'; 
import {useState} from 'react';
// import './index.css';
import styles from './css/reviewList.module.css';

function ReviewList (prop) {

    const reviews = prop.reviews;

    const [fav, setFav] = useState(false);
    const favorite = () => {
        if (fav){
            setFav(false);
        } else {
            setFav(true);
        }
    }

    return (
        <div className="review-list">
            {reviews.map((r) => (
                <div className={styles.normal} key={r.id}>
                    <h1 className={styles.h1}> {r.bookname} </h1>
                    <h2 className={styles.h2}> Published by {r.name} </h2>
                    <p> {r.body} </p>
                    <div className={styles.footer}>
                        <p> {r.categories} </p>
                        {!fav && <FavoriteBorderIcon className={styles.footerRight} onClick={() => {favorite();}}/>}
                        {fav && <FavoriteIcon className={styles.footerRight} onClick={() => {favorite();}}/>}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ReviewList;
