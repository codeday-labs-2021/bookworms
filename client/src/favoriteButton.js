import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite'; 

class LikeButton extends React.Component {
  constructor() {
    super();
    this.state = {
      liked: false
    }
  }
  
  handleClick = e => {
    this.setState({
      liked: !this.state.liked
    });
  }
  
  render() {
    const text = this.state.liked ? 'Like' : 'Unlike'
    
    return (
      <button onClick={ this.handleClick }>{ text }</button>
    );
  }
}


ReactDOM.render(<LikeButton />, document.getElementById('root'));