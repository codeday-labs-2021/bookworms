import SearchIcon from '@material-ui/icons/Search';
import {useState} from 'react';

function SearchBar () {

    const [filteredData, setFilteredData] = useState([]);
    const [wordEntered, setWordEntered] = useState("");  

    const handleSearch = (event) => {
        const searchWord = event.target.value;
        setWordEntered(searchWord);
    
        if (searchWord === "") {
          setFilteredData([]);
        } else {
        //   setFilteredData(newFilter);
        }
    }
    
    const clearInput = () => {
        setFilteredData([]);
        setWordEntered("");
    };
    

    return (
        <div className="search">
            <input 
                type="text" 
                placeholder="Enter a Book Name..."
                value={wordEntered}
                onChange={handleSearch}
                />
            <SearchIcon />
        </div>
    );
}

export default SearchBar;