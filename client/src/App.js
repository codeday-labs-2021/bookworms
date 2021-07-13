import Navbar from './Navbar';
import Home from './Home';
import Create from './Create';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

/**
 * The root of the app
 *  
 */

function App() {
  return (
    <BrowserRouter basename="/bookworms">
      <div className="App">
        <Navbar />
        <div className="content">
          <Switch>
            <Route exact path="/"> 
              <Home />
            </Route>
            <Route path="/create"> 
              <Create />
            </Route>
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
