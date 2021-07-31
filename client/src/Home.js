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

/**
 * Homepage
 * 
 */

function Home(props) {    

    // reviews components 
    const [reviews, setReviews] = useState([]);
    const [isPending, setIsPending] = useState(true);
    const baseUrl = 'https://bookworms-api.vercel.app/api/reviews';
    const [url, setUrl] = useState(baseUrl);

    const triggerGetReview = useCallback(() => {
        getReview(url);
    }, [url]);

    // filter order
    const [orderValue, setOrderValue] = useState('latest');

    const changeOrder = (option) => {
        if (option === 'latest'){
            setUrl(baseUrl);
        } else if (option === 'popular') {
            setUrl(baseUrl + '?sort=likes&sortOrder=1');
        } else if (option === 'bookasc') {
            setUrl(baseUrl + '?sort=book_name&sortOrder=-1');
        } else {
            setUrl(baseUrl + '?sort=book_name&sortOrder=1');
        }
        setOrderValue(option);
        triggerGetReview();
    }

    // search
    const searchReview = (term) => {
        if (term === ""){
            setUrl(baseUrl);
        } else {
            setUrl(baseUrl + '?search=' + term + '&sort=likes&sortOrder=1');
        }
        triggerGetReview();
    }

    // fetch reviews
    async function getReview (url) {
        const response = await fetch(url,{
            method: 'GET',
            headers: {'Accept': 'application/json'},
        });
        if (!response.ok) {
            const message = `An error has occured: ${JSON.stringify(await response.status)}`;
            throw new Error(message);
        } else {
            const reviewsArray = await response.json();
            setReviews(reviewsArray.data);
            setIsPending(false);
        }
    }

    useEffect(() => triggerGetReview(), [triggerGetReview]);

    return (
        <div>
            <div className={styles.top}>
                <div className={styles.filter}>
                    <SearchBar handleSearch={searchReview}/> 
                    <div className={styles.order}><FilterOrder orderValue={orderValue} handleChange={changeOrder}/></div>
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