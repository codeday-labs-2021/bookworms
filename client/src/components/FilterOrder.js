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

export default function FilterOrder() {
  const classes = useStyles();
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
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
          <MenuItem value={10}>Book Name (Ascending)</MenuItem>
          <MenuItem value={20}>Book Name (Descending)</MenuItem>
          <MenuItem value={30}>Popularity</MenuItem>
          <MenuItem value="">Latest Reviews</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
