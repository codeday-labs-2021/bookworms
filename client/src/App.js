import Navbar from './components/Navbar';
import Home from './Home';
import Create from './components/form/Create';
import Signup from './components/form/SignUp';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {createTheme, ThemeProvider} from '@material-ui/core';

/**
 * The root of the app
 *  
 */

const theme = createTheme ({
  palette: {
    primary: {
      main: '#dd9f33',
      contrastText: '#fff',
    }
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router basename="/bookworms">
        <Switch>
          <Route path="/signup">
            <Signup />
          </Route>
          <div className="App">
            <Navbar />
            <div className="content">
                <Route exact path="/"> 
                  <Home />
                </Route>
                <Route path="/create"> 
                  <Create />
                </Route>
            </div>
          </div>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
