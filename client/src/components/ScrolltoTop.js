import {makeStyles} from '@material-ui/core/styles';
import Zoom from '@material-ui/core/Zoom';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
}));

export default function ScrollTop(props) {
    const {children} = props;
    const classes = useStyles();
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100,
    });

    const handleClick = (e) => {
        const anchor = (e.target.ownerDocument || document).querySelector('#back-to-top-anchor');

        if (anchor) {
            window.scrollTo({top: 0, behavior: 'smooth', block: 'center'});
        }
    };
        
    return (
        <Zoom in={trigger}>
            <div onClick={handleClick} role="presentation" className={classes.root}>
                {children}
            </div>
        </Zoom>
    );
}