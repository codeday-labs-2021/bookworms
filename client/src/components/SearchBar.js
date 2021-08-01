import {useState} from 'react';
import Icon from '@material-ui/core/Icon';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import FilterCategories from './FilterCategories';
import styles from '../css/searchBar.module.css';

function SearchBar(props) {

    // search bar components 
    const [wordEntered, setWordEntered] = useState('');  
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = (e) => {
        const searchWord = e.target.value;
        setWordEntered(searchWord);
    
        if (searchWord === '') {
            setIsSearching(false);
        } else {
          setIsSearching(true);
        }
        props.handleSearch(searchWord);
    }
    
    const clearInput = () => {
        props.handleSearch("");
        setWordEntered('');
        setIsSearching(false);
    };
    
    const BarIcon = isSearching ? CloseIcon : SearchIcon;

    // filter component
    const [filterShow, setFilterShow] = useState(false);

    return (
        <div className={styles.search}>
            <input 
                type="text" 
                className={styles.searchTerm}
                placeholder="Enter a Book Name..."
                value={wordEntered}
                onChange={handleSearch}
                />
            <Icon className={styles.filterButton} onClick={() => setFilterShow(true)}> filter_list </Icon>

            <FilterCategories
                show={filterShow}
                onHide={() => setFilterShow(false)}
            />

            <BarIcon
                className={styles.searchButton}
                onClick={clearInput}/>
        </div>
    );
}

export default SearchBar;