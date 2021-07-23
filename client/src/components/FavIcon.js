import React, { Component } from "react";
import UnfavoriteIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
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
    const label = this.state.faved ? <FavoriteIcon/> : <UnfavoriteIcon/>;

    return (
        <span onClick={this.handleClick} className={styles.fav}>
          {label}
        </span>
    );
  }
}

export default FavIcon;
