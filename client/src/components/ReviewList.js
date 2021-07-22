import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite'; 
import {useState} from 'react';
import styles from '../css/reviewList.module.css';

function ReviewList ({reviews}) {

    const [fav, setFav] = useState(false);
    const toggleFavorite = () => {
       setFav(!fav);
    }

    const FavIcon = fav ? FavoriteIcon : FavoriteBorderIcon;

    return (
        <div className="review-list">
            {reviews.map((r) => (
                <div className={styles.normal} key={r.id}>
                    <h1 className={styles.title}> {r.book_name} </h1>
                    <h2 className={styles.author}> Published by {r.user_name} </h2>
                    <p> {r.text} </p>
                    <div className={styles.footer}>
                        <p> {r.categories.join(', ')} </p>
                        <FavIcon 
                            className={styles.footerRight} 
                            onClick={toggleFavorite}/>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ReviewList;
