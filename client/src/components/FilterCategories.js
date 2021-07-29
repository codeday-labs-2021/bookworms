import {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import Chip from '@material-ui/core/Chip';
import styles from '../css/categories.module.css';

function FilterCategories () {

    const [categories, setCategories] = useState([]);

    const getCategories = useCallback(async () => {
        const response = await axios.get('https://bookworms-api.vercel.app/api/categories');

        if (!response.data.success) {
            const message = `An error has occured: ${JSON.stringify(await response.status)}`;
            throw new Error(message);
        } else {
            const categoriesArray = response.data.data;
            setCategories(categoriesArray);
        }
    }, []);

    useEffect(() => getCategories(), [getCategories]);

    return (
        <div className={styles.categories}> 
            {categories.map((c, i) => 
                <Chip 
                    key={i}
                    label={c}
                    className={styles.chip}/>
            )}
        </div>
    ) ;
}

export default FilterCategories;