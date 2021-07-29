import logo from '../logo192.png';
import {Link} from 'react-router-dom';
import {useState} from 'react';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import styles from '../css/navBar.module.css'
import Signin from './form/SignIn';

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
                    <Link to ="/create"><Icon color="primary" className={styles.button} fontSize="large">add</Icon></Link>
                </Tooltip>
                <Tooltip title="Sign In">
                    <Icon color="primary" className={styles.button} fontSize="large" onClick={() => setSignInShow(true)}>local_library</Icon>
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