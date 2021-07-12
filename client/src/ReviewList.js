import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite'; 
import {useState} from 'react';

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
                <div className="review-preview" key={r.id}>
                    <h1> {r.bookname} </h1>
                    <h2> Published by {r.name} </h2>
                    <p> {r.body} </p>
                    <div className="footer">
                        <p> {r.categories} </p>
                        {!fav && <FavoriteBorderIcon className="footer-right" onClick={() => {favorite();}}/>}
                        {fav && <FavoriteIcon className="footer-right" onClick={() => {favorite();}}/>}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ReviewList;
