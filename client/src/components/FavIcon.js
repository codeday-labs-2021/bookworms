import {useState} from 'react';
import Icon from '@material-ui/core/Icon';
import styles from '../css/favIcon.module.css';

/**
 * Fav icon for individual review
 * @param reviewId the review id to delete, if click
 * 
 */

function FavIcon ({reviewId}) {

  const [faved, setFaved] = useState(false);

  const handleClick = () => {
    setFaved(!faved);
    updateFav();
  }

  async function updateFav(){
    const response = await fetch('https://bookworms-api.vercel.app/api/like/' + reviewId, {       
      method: 'POST',
      credentials: 'include',
    })
    // if the request wasn't successful, throw an error for the user to know 
    if (!response.ok) {
        const message = `An error has occured: ${JSON.stringify(await response.json())}`;
        throw new Error(message);
    } else {
      console.log("fav")
    }
  }

  const label = faved ? <Icon style={{color: '#f50057'}}>favorite</Icon> : <Icon>favorite_border</Icon>;

  return (
    <span onClick={handleClick} className={styles.fav}>
      {label}
    </span>
  );
}
export default FavIcon;