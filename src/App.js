/* eslint-disable react/style-prop-object */
import React, { Component } from "react";
import "./App.css";
import Login from "./Login_Page/Login";
import Search from "./Search_Contest_Page/Search";
import Problems from "./Contest_Problems_Page/Problems";
import Pstatement from "./Problem_Statement_Page/Pstatement";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

export default class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/">
              <Login />
            </Route>

            <Route path="/search">
              <Search />
            </Route>
            <Route path="/contest">
              <Problems />
            </Route>

            <Route path="/problem">
              <Pstatement />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}
