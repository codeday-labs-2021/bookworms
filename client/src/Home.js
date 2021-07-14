import ReviewList from './ReviewList';
import SearchBar from './tools/SearchBar';
import FilterOrder from './tools/FilterOrder';
import data from './reviewData.json';
import Toolbar from '@material-ui/core/Toolbar';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Fab from '@material-ui/core/Fab';
import ScrollTop from './tools/ScrolltoTop';
import styles from './css/home.module.css';

/**
 * Homepage
 * 
 */

function Home(props) {    

    return (
        <div>
            <div className={styles.top}>
                <SearchBar /> 
                <div className={styles.topRight}><FilterOrder /></div>
            </div>
            <div className="body">
                <ReviewList reviews={data}/>
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