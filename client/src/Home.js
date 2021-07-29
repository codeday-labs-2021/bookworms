import ReviewList from './components/ReviewList';
import SearchBar from './components/SearchBar';
import FilterOrder from './components/FilterOrder';
import FilterCategories from './components/FilterCategories';
import Toolbar from '@material-ui/core/Toolbar';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Fab from '@material-ui/core/Fab';
import ScrollTop from './components/ScrolltoTop';
import styles from './css/home.module.css';
import {useState, useEffect, useCallback} from 'react';
import axios from 'axios';

/**
 * Homepage
 * 
 */

function Home(props) {    

    const [reviews, setReviews] = useState([]);
    const [isPending, setIsPending] = useState(true);

    const getReview = useCallback(async () => {
        const response = await axios.get('https://bookworms-api.vercel.app/api/reviews');

        if (!response.data.success) {
            const message = `An error has occured: ${JSON.stringify(await response.status)}`;
            throw new Error(message);
        } else {
            const reviewsArray = response.data.data;
            setReviews(reviewsArray);
            setIsPending(false);
        }
    }, [])

    useEffect(() => getReview(), [getReview]);

    return (
        <div>
            <div className={styles.top}>
                <div className={styles.filter}>
                    <SearchBar /> 
                    <div className={styles.order}><FilterOrder /></div>
                </div>
                <FilterCategories />
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