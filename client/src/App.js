import Navbar from './components/Navbar';
import Home from './Home';
import Create from './Create';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {createTheme, ThemeProvider} from '@material-ui/core';

/**
 * The root of the app
 *  
 */

const theme = createTheme ({
  palette: {
    primary: {
      main: '#dd9f33'
    }
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router basename="/bookworms">
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
      </Router>
    </ThemeProvider>
  );
}

export default App;
