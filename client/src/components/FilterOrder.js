import {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 120,
  },
}));

export default function FilterOrder(props) {
  const classes = useStyles();
  const [value, setValue] = useState(props.orderValue);

  const handleChange = (e) => {
    const option = e.target.value;
    setValue(option);
    props.handleChange(option);
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <Select
          value={value}
          onChange={handleChange}
          displayEmpty
          className={classes.selectEmpty}
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
