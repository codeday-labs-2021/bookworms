import logo from '../logo192.png';
import {Link} from 'react-router-dom';
import {useState} from 'react';
import AddIcon from '@material-ui/icons/Add';
import SigninIcon from '@material-ui/icons/LocalLibrary';
import Tooltip from '@material-ui/core/Tooltip';
import styles from '../css/navBar.module.css'
import Signin from './form/Signin';

/**
 * The navigation bar
 * 
 */

function Navbar() {

    const [signInShow, setSignInShow] = useState(false);

    return (
        <nav className={styles.navbar}>
            <img src={logo} height={45} width={45} alt="logo"></img>
            <Link to="/"> <h1 className={styles.name}>bookworms</h1> </Link>
            <div className={styles.links}>
                <Tooltip title="Add Reviews">
                    <Link to ="/create"><AddIcon color="primary" className={styles.button} fontSize="large"/></Link>
                </Tooltip>
                <Tooltip title="Login">
                    <SigninIcon color="primary" className={styles.button} fontSize="large" onClick={() => setSignInShow(true)}/>
                </Tooltip>
                <Signin         
                    show={signInShow}
                    onHide={() => setSignInShow(false)}
                />
            </div>
        </nav>
    );
} 

export default Navbar;