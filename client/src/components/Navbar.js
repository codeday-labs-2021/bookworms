import logo from '../logo192.png';
import {Link} from 'react-router-dom';
import {useState} from 'react';
import AddIcon from '@material-ui/icons/Add';
import LoginIcon from '@material-ui/icons/LocalLibrary';
import Tooltip from '@material-ui/core/Tooltip';
import styles from '../css/navBar.module.css'
import Signin from './form/Signin';

/**
 * The navigation bar
 * 
 */

function Navbar() {

    const [loginShow, setLoginShow] = useState(false);

    return (
        <nav className={styles.navbar}>
            <img src={logo} height={45} width={45} alt="logo"></img>
            <Link to="/"> <h1 className={styles.name}>bookworms</h1> </Link>
            <div className={styles.links}>
                <Tooltip title="Add Reviews">
                    <Link to ="/create"><AddIcon color="primary" className={styles.button} fontSize="large"/></Link>
                </Tooltip>
                <Tooltip title="Login">
                    <LoginIcon color="primary" className={styles.button} fontSize="large" onClick={() => setLoginShow(true)}/>
                </Tooltip>
                <Signin         
                    show={loginShow}
                    onHide={() => setLoginShow(false)}
                />
            </div>
        </nav>
    );
} 

export default Navbar;