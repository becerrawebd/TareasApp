import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./paginas/login";
import Signup from "./paginas/signup";
import Home from "./paginas/Home";
import "typeface-roboto";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

const theme = createMuiTheme({
  palette: {
    secondary: {
      light: "#33c9dc",
      main: "#FF5722",
      dark: "#d50000",
      contrastText: "#fff",
    },
  },
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
        </Switch>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
