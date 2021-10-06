import logo from '../logo192.png';
import {Link, useHistory} from 'react-router-dom';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover';
import SignoutButton from 'react-bootstrap/Button';
import {makeStyles} from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import styles from '../css/navBar.module.css';

// material ui styles
const useStyles = makeStyles ({
    signOut: {
        border: 0,
        backgroundColor: '#dd9f33',
        '&:hover': {
            backgroundColor: '#b58026',
        }
    }
})

/**
 * The navigation bar
 * 
 */

function Navbar () {
    
    const classes = useStyles();
    const history = useHistory();

    const handleSignOut = () => {
        history.push("/");
    }
    
    // user's account details
    const popOver = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">My Account</Popover.Header>
            <Popover.Body>
                <SignoutButton onClick={handleSignOut} className={classes.signOut}> Sign out </SignoutButton>
            </Popover.Body>
      </Popover>    
    );

    return (
        <nav className={styles.navbar}>
            <img src={logo} height={45} width={45} alt="logo"></img>
            <Link to="/home"> <h1 className={styles.name}>bookworms</h1> </Link>
            <div className={styles.links}>
                <Tooltip title="Add Reviews">
                    <Link to ="/create"><Icon color="primary" className={styles.icons} fontSize="large">add</Icon></Link>
                </Tooltip>
                <OverlayTrigger trigger="click" placement="bottom" overlay={popOver}>
                    <Tooltip title="My Account">
                        <Icon color="primary" className={styles.icons} fontSize="large">local_library</Icon>
                    </Tooltip>
                </OverlayTrigger>
            </div>
        </nav>
    );
} 
export default Navbar;