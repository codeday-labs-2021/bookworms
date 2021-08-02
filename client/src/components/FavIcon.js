import {useState} from 'react';
import Icon from '@material-ui/core/Icon';
import styles from '../css/favIcon.module.css';

function FavIcon () {
  const [faved, setFaved] = useState(false);

  const handleClick = () => {
    setFaved(!faved);
  }

  const label = faved ? <Icon style={{color: '#f50057'}}>favorite</Icon> : <Icon>favorite_border</Icon>;

  return (
    <span onClick={handleClick} className={styles.fav}>
      {label}
    </span>
  );
}

export default FavIcon;
