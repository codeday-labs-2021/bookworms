import {useState, useEffect, useCallback} from 'react';
import ReviewList from './components/ReviewList';
import SearchBar from './components/SearchBar';
import FilterOrder from './components/FilterOrder';
import ScrollTop from './components/ScrolltoTop';
import getQuery from './components/getQuery';
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

    // keep track of what filters user is changing
    let query = {
        search: '',
        categories: '',
        sort: '',
        sortOrder: ''
    }

    const triggerGetReview = useCallback(() => {
        getReview(url);
    }, [url]);

    // filter order
    const [orderValue, setOrderValue] = useState('latest');

    const changeOrder = (option) => {
        if (option === 'popular') {
            query = {sort: 'likes', sortOrder:'-1'};
        } else if (option === 'bookasc') {
            query = {sort: 'book_name', sortOrder:'1'};
        } else if (option === 'bookdesc') {
            query = {sort: 'book_name', sortOrder:'-1'};
        }
        setOrderValue(option);
        const orderOption = getQuery(query);
        setUrl(`${baseUrl}?${orderOption}`);
        triggerGetReview();
    }

    // search
    const searchReview = (term) => {
        if (term !== ''){
            query = {search: term, sort: 'likes', sortOrder: '1'};
        }
        const search = getQuery(query);
        setUrl(`${baseUrl}?${search}`);
        triggerGetReview();
    }

    // filter categories
    const updateCategories = (categoriesArray) => {
        if (categoriesArray){
            query = {categories: '' + categoriesArray.join(',')}
        }
        const categoriesChosen = getQuery(query);
        setUrl(`${baseUrl}?${categoriesChosen}`);
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

    useEffect(() => triggerGetReview(), [triggerGetReview, url]);

    return (
        <div>
            <div className={styles.top}>
                <div className={styles.filter}>
                    <SearchBar searchReview={searchReview} updateCategories={updateCategories}/> 
                    <div className={styles.order}><FilterOrder orderValue={orderValue} changeOrder={changeOrder}/></div>
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