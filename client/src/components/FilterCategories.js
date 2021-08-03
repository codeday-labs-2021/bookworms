import {useState, useEffect, useCallback} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {makeStyles} from '@material-ui/core';
import axios from 'axios';

// react component styles
const useStyles = makeStyles ({
    title: {
        color: '#dd9f33',
    },

    close: {
        border: 0,
        backgroundColor: '#dd9f33',
        '&:hover': {
            backgroundColor: '#b58026',
        }
    }
})

/**
 * Pop-up for filtering categories
 * @param props props send from Searchbar to update categories filtered 
 *  
 */

function FilterCategories (props) {

    // css for components
    const classes = useStyles();

    // all categories
    const [categories, setCategories] = useState([]);
    // filtered categories
    const [selectedCat, setSelectedCat] = useState([]);

    // other page component
    const [isPending, setIsPending] = useState(true);
    
    // add to the filtered list
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
        <div> 
            {isPending ? "" : 
                <Modal
                {...props}
                size="lg"
                aria-labelledby="filter"
                centered
              >
                <Modal.Header>
                    <Modal.Title className={classes.title}> Filter by Categories </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormControl>
                        <FormGroup>
                            {categories.map((c,i) => {
                                return (
                                    <FormControlLabel
                                        key={i}
                                        control={<Checkbox 
                                                    disableRipple 
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
                    <Button type="submit" onClick={handleClose} className={classes.close}> Close </Button>
                </Modal.Footer>
              </Modal>
            }
        </div>
    ) ;

}
export default FilterCategories;