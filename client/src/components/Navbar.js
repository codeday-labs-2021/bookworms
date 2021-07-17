import logo from '../logo192.png';
import {Link} from 'react-router-dom';
import styles from '../css/navBar.module.css'

/**
 * The navigation bar
 * 
 */

function Navbar() {
    return (
        <nav className={styles.navbar}>
            <img src={logo} height={45} width={45} alt="logo"></img>
            <Link to="/"> <h1 className={styles.name}>bookworms</h1> </Link>
            <div className={styles.links}>
                <Link to ="/create"><button className={styles.addButton}>Add Review</button></Link>
            </div>
        </nav>
    );
} 

export default Navbar;