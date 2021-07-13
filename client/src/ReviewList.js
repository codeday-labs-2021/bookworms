import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite'; 
import {useState} from 'react';
import styles from './css/reviewList.module.css';

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
                    <h1 className={styles.h1}> {r.bookname} </h1>
                    <h2 classNmae={styles.h2}> Published by {r.name} </h2>
                    <p> {r.body} </p>
                    <div className={styles.footer}>
                        <p> {r.categories} </p>
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
