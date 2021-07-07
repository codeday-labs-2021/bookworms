import logo from './logo.png';
import {Link} from 'react-router-dom';

/**
 * The navigation bar
 * 
 */
function Navbar() {
    return (
        <nav className = "navbar">
            <img src = {logo} height={45} width={45} alt="logo"></img>
            <h1> bookworms </h1>
            <div className = "links">
                <Link to ="/">Home</Link>
                <Link to ="/create" style = {{
                    color: 'white',
                    backgroundColor: '#dd9f33',
                    borderRadius: '8px',
                }}>Add Review</Link>
            </div>
        </nav>
    );
} 

export default Navbar;