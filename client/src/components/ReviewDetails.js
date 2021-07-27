import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

function ReviewDetails() {

    const [isPending, setIsPending] = useState(true);
    const [reviewDetails, setReviewDetails] = useState([]);

    const {id} = useParams();

    async function getDetails(){
        const response = await fetch('https://bookworms-api.vercel.app/api/reviews', {
            method: 'GET',
            headers: {'Accept': 'application/json'},
        });

        if (!response.ok){
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        } else {
            const reviewsArray = await response.json();
            var details = [];

            for (var i = 0; i < reviewsArray.data.length; i++){
                if (reviewsArray.data[i].id === id){
                    details = (reviewsArray.data[i]);
                    break;
                }
            }
            setReviewDetails(details);
            setIsPending(false);
        }
    }

    useEffect(() => getDetails(), []);

    return (
        <div>
            {isPending ? "Loading..." :
                <div>
                    <h1> {reviewDetails.book_name} </h1>
                    <h2> Published by {reviewDetails.user_name} </h2>
                    <p> {reviewDetails.text} </p>
                </div>
            }
        </div>
    );
}

export default ReviewDetails;