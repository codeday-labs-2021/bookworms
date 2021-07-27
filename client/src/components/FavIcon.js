import {Component} from 'react';
import Icon from '@material-ui/core/Icon';
import styles from '../css/favIcon.module.css';

class FavIcon extends Component {
  constructor() {
    super();
    this.state = {
      faved: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({
      faved: !this.state.faved
    });
  }

  render() {
    const label = this.state.faved ? <Icon style={{color: '#f50057'}}>favorite</Icon> : <Icon>favorite_border</Icon>;

    return (
        <span onClick={this.handleClick} className={styles.fav}>
          {label}
        </span>
    );
  }
}

export default FavIcon;
