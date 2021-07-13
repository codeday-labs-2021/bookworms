import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import {useState} from 'react';

function SearchBar () {

    // const [filteredData, setFilteredData] = useState([]);
    const [wordEntered, setWordEntered] = useState("");  
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = (event) => {
        const searchWord = event.target.value;
        setWordEntered(searchWord);
    
        if (searchWord === "") {
        //   setFilteredData([]);
        } else {
        //   setFilteredData(searchWord);
          setIsSearching(true);
        }
    }
    
    const clearInput = () => {
        // setFilteredData([]);
        setWordEntered("");
        setIsSearching(false);
    };
    
    const BarIcon = isSearching ? CloseIcon : SearchIcon;

    return (
        <div className="search">
            <input 
                type="text" 
                className="searchTerm"
                placeholder="Enter a Book Name..."
                value={wordEntered}
                onChange={handleSearch}
                />
            <BarIcon 
                className="searchButton"
                onClick={clearInput}/>
        </div>
    );
}

export default SearchBar;