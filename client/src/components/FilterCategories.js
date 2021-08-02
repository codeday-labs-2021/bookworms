import {useState, useEffect, useCallback} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import axios from 'axios';
import styles from '../css/categories.module.css';

function FilterCategories (props) {

    // all categories
    const [categories, setCategories] = useState([]);
    // filtered categories
    const [selectedCat, setSelectedCat] = useState([]);

    // page component
    const [isPending, setIsPending] = useState(true);
    
    // add the filtered list
    const addCategories = (category) => {
        const tempAdd = selectedCat.concat(category);
        setSelectedCat(tempAdd);
    }

    // remove from the filtered list
    const removeCategories = (category) => {
        const tempRemove = selectedCat.filter((c) => c !== category);
        setSelectedCat(tempRemove);
    }

    const handleChange = (e) => {
        const checked = e.target.checked;
        const chosenCat = e.target.name;
        if (checked){
            addCategories(chosenCat);
        } else {
            removeCategories(chosenCat)
        }
    };

    const handleClose = () => {
        props.handleChange(selectedCat);
        props.onHide();
    }

    // get all categories for users to choose from
    const getCategories = useCallback(async () => {
        const response = await axios.get('https://bookworms-api.vercel.app/api/categories');
        if (!response.data.success) {
            const message = 'An error has occured';
            throw new Error(message);
        } else {
            const categoriesArray = await response.data.data;
            setCategories(categoriesArray);
            setIsPending(false);
        }
    }, []);

    useEffect(() => getCategories(), [getCategories]);

    return (
        <div className={styles.categories}> 
            {isPending ? "" : 
                <Modal
                {...props}
                size="lg"
                aria-labelledby="filter"
                centered
              >
                <Modal.Header>
                    <Modal.Title> Filter by Categories </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormControl>
                        <FormGroup>
                            {categories.map((c,i) => {
                                return (
                                    <FormControlLabel
                                        color="primary"
                                        key={i}
                                        control={<Checkbox 
                                                    disableRipple 
                                                    color="primary" 
                                                    onChange={handleChange} 
                                                    name={c} />}
                                        label={c}
                                    />
                                );
                            })}
                        </FormGroup>
                    </FormControl>

                </Modal.Body>
          
                <Modal.Footer>
                    <Button type="submit" onClick={handleClose} className={styles.closeButton}> Close </Button>
                </Modal.Footer>
              </Modal>
            }
        </div>
    ) ;

}
export default FilterCategories;