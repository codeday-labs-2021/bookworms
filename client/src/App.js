import Navbar from './components/Navbar';
import Home from './Home';
import Create from './components/form/Create';
import Signin from './components/form/SignIn';
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
      main: '#dd9f33'
    }
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router basename="/bookworms">
        <Switch>
          <Route exact path="/">
            <Signin />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <div className="App">
            <Navbar />
            <div className="content">
                <Route path="/home"> 
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
