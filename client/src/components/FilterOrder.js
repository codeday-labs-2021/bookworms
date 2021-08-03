import {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

// styles for form
const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 120,
  },
}));

/**
 * Dropdown for filtering order of reviews
 * @param orderValue the option that user clicks on to filter
 * @param changeOrder function from Home to trigger the changes
 *  
 */

export default function FilterOrder ({orderValue, changeOrder}) {
  const classes = useStyles();
  const [value, setValue] = useState(orderValue);

  const handleChange = (e) => {
    const option = e.target.value;
    setValue(option);
    changeOrder(option);
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <Select
          value={value}
          onChange={handleChange}
          displayEmpty
        >
          <MenuItem value="latest">Latest Reviews</MenuItem>
          <MenuItem value="popular">Popularity</MenuItem>
          <MenuItem value="bookasc">Book Name (Ascending)</MenuItem>
          <MenuItem value="bookdesc">Book Name (Descending)</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}