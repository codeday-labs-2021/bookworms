import SearchIcon from '@material-ui/icons/Search';
import {useState} from 'react';
import styles from '../css/searchBar.module.css';

function SearchBar () {

    // const [filteredData, setFilteredData] = useState([]);
    const [wordEntered, setWordEntered] = useState("");  

    const handleSearch = (e) => {
        const searchWord = e.target.value;
        setWordEntered(searchWord);
    
        // if (searchWord === "") {
        //   setFilteredData([]);
<<<<<<< Updated upstream
        // } else {
        //   setFilteredData(newFilter);
        // }
=======
            setIsSearching(false);
        } else {
        //   setFilteredData(searchWord);
          setIsSearching(true);
        }
>>>>>>> Stashed changes
    }
    
    // const clearInput = () => {
    //     setFilteredData([]);
    //     setWordEntered("");
    // };
    

    return (
        <div className={styles.search}>
            <input 
                type="text" 
                className={styles.inputArea && styles.searchTerm}
                placeholder="Enter a Book Name..."
                value={wordEntered}
                onChange={handleSearch}
                />
<<<<<<< Updated upstream
            <SearchIcon className="searchButton"/>
=======
            <BarIcon
                className={styles.searchButton}
                onClick={clearInput}/>
>>>>>>> Stashed changes
        </div>
    );
}

export default SearchBar;