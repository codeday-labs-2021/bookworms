import {useState, useEffect, useCallback} from 'react';
import ReviewList from './components/ReviewList';
import SearchBar from './components/SearchBar';
import FilterOrder from './components/FilterOrder';
import ScrollTop from './components/ScrolltoTop';
import Toolbar from '@material-ui/core/Toolbar';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import axios from 'axios';
import styles from './css/home.module.css';

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
            const searchUrl = '?search=' + term + '&sort=likes&sortOrder=1';
            setUrl(baseUrl + searchUrl);
        }
        triggerGetReview();
    }

    // filter categories
    const updateCategories = (categoriesArray) => {
        if (categoriesArray){
            const filterUrl = '?categories=' + categoriesArray.join(',');
            setUrl(baseUrl + filterUrl);
        } else {
            setUrl(baseUrl);
        }
        triggerGetReview();
    }

    // fetch reviews
    async function getReview (url) {
        const response = await axios.get(url);
        if (!response.data.success) {
            const message = 'An error has occured';
            throw new Error(message);
        } else {
            const reviewsArray = await response.data.data;
            setReviews(reviewsArray);
            setIsPending(false);
        }
    }

    useEffect(() => triggerGetReview(), [triggerGetReview]);

    return (
        <div>
            <div className={styles.top}>
                <div className={styles.filter}>
                    <SearchBar handleSearch={searchReview} handleFilter={updateCategories}/> 
                    <div className={styles.order}><FilterOrder orderValue={orderValue} handleChange={changeOrder}/></div>
                </div>
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