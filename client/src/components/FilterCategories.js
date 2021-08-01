import {useState, useEffect, useCallback} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import styles from '../css/categories.module.css';

function FilterCategories (props) {

    const [categories, setCategories] = useState([]);
    const [isPending, setIsPending] = useState(true);

    const [selectedCat, setSelectedCat] = useState([]);
      
    const [isClicked, setIsClicked] = useState(false);

    const handleChange = (e) => {
        setSelectedCat(e.target.value);
    };

    const getCategories = useCallback(async () => {
        const response = await fetch('https://bookworms-api.vercel.app/api/categories', {
            method: 'GET',
            headers: {'Accept': 'application/json'},
        });

        if (!response.ok) {
            const message = `An error has occured: ${JSON.stringify(await response.status)}`;
            throw new Error(message);
        } else {
            const categoriesArray = await response.json();
            setCategories(categoriesArray.data);
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
                    <FormControl component="fieldset">
                        <FormGroup>
                            {categories.map((c,i) => {
                                return (
                                    <FormControlLabel
                                        key={i}
                                        control={<Checkbox onChange={handleChange} name={c} />}
                                        label={c}
                                    />
                                );
                            })}
                        </FormGroup>
                    </FormControl>

                </Modal.Body>
          
                <Modal.Footer>
                    <Button type="submit" onClick={props.onHide}> Close </Button>
                </Modal.Footer>
              </Modal>
            }
        </div>
    ) ;

}
export default FilterCategories;