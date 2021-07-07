function ReviewList (prop) {

    const reviews = prop.reviews;

    return (
        <div className = "review-list">
            {reviews.map((review) => (
                <div className = "review-preview" key = {review.id}>
                    <h2> Published by {review.author} </h2>
                </div>
            ))}
        </div>
    );
}

export default ReviewList;
