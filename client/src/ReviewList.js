import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
// import FavoriteIcon from '@material-ui/icons/Favorite'; 

function ReviewList (prop) {

    const reviews = prop.reviews;

    return (
        <div className="review-list">
            {reviews.map((review) => (
                <div className="review-preview" key={review.id}>
                    <h1> {review.bookname} </h1>
                    <h2> Published by {review.name} </h2>
                    <p> {review.body} </p>
                    <div className="footer">
                        <p> {review.categories} </p>
                        <FavoriteBorderIcon className="footer-right"/>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ReviewList;
