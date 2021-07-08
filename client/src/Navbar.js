import logo from './logo192.png';
import {Link} from 'react-router-dom';

/**
 * The navigation bar
 * 
 */
function Navbar() {
    return (
        <nav className="navbar">
            <img src = {logo} height={45} width={45} alt="logo"></img>
            <Link to="/"> <h1> bookworms </h1> </Link>
            <div className="links">
                <Link to ="/create"> <button>Add Review </button></Link>
            </div>
        </nav>
    );
} 

export default Navbar;