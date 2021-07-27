import ReviewList from './components/ReviewList';
import SearchBar from './components/SearchBar';
import FilterOrder from './components/FilterOrder';
import useFetch from './components/useFetch';
import Toolbar from '@material-ui/core/Toolbar';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Fab from '@material-ui/core/Fab';
import ScrollTop from './components/ScrolltoTop';
import styles from './css/home.module.css';
import {useState, useEffect} from 'react';

/**
 * Homepage
 * 
 */

function Home(props) {    

    const {data: reviews, isPending, error} = useFetch('https://bookworms-api.vercel.app/api/reviews', 'GET');

    if (error){
        throw new Error(error);
    }

    // const [reviews, setReviews] = useState([]);
    // const [isPending, setIsPending] = useState(true);

    // async function getReview(){
    //     const response = await fetch('https://bookworms-api.vercel.app/api/reviews', {
    //         method: 'GET',
    //         headers: {'Accept': 'application/json'},
    //     });

    //     if (!response.ok){
    //         const message = `An error has occured: ${response.status}`;
    //         throw new Error(message);
    //     } else {
    //         const reviewsArray = await response.json();
    //         setReviews(reviewsArray.data);
    //         setIsPending(false);
    //     }
    // }

    // useEffect(() => getReview(), []);

    return (
        <div>
            <div className={styles.top}>
                <SearchBar /> 
                <div className={styles.topRight}><FilterOrder /></div>
            </div>
            <div className={styles.body}>
               {isPending ? "Loading..." : <ReviewList reviews={reviews}/>}
            </div>
            <Toolbar id="back-to-top-anchor" />
                <ScrollTop {...props}>
                    <Fab size="small" aria-label="scroll to top">
                        <KeyboardArrowUpIcon />
                    </Fab>
                </ScrollTop>
        </div>
    );
}

export default Home;