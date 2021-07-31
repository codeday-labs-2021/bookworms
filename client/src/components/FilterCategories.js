import {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import Chip from '@material-ui/core/Chip';
import styles from '../css/categories.module.css';

function FilterCategories () {

    const [categories, setCategories] = useState([]);
    const [isPending, setIsPending] = useState(true);
    const [choosenCat, setChoosenCat] = useState([]);

    const getCategories = useCallback(async () => {
        const response = await fetch('https://bookworms-api.vercel.app/api/categories', {
            method: 'GET',
            headers: {'Accept': 'application/json'},
        });

        if (!response.ok) {
            const message = `An error has occured: ${JSON.stringify(await response.status)}`;
            throw new Error(message);
        } else {
            const categoriesArray = response.json();
            setCategories(categoriesArray.data);
            setIsPending(false);
        }
    }, []);

    useEffect(() => getCategories(), [getCategories]);

    return (
        <div className={styles.categories}> 
            {isPending ? undefined: categories.map((c, i) => 
                <Chip 
                    key={i}
                    label={c}
                    variant="outlined"
                    color="primary"
                    clickable
                    disableRipple
                    className={styles.chip}/>
            )}
        </div>
    ) ;
}

export default FilterCategories;