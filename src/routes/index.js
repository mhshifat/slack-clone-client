import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoggedInRoute from "../components/hoc/LoggedInRoute";
import LoggedOutRoute from "../components/hoc/LoggedOutRoute";
import CreateTeam from "../pages/CreateTeam";
import Homepage from "../pages/Homepage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ViewTeam from "../pages/ViewTeam";

class Routes extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Homepage} />
          <LoggedOutRoute exact path="/login" component={Login} />
          <LoggedOutRoute exact path="/register" component={Register} />
          <LoggedInRoute exact path="/create-team" component={CreateTeam} />
          <LoggedInRoute
            exact
            path="/view-team/:teamId?/:channelId?"
            component={ViewTeam}
          />
          <LoggedInRoute
            exact
            path="/view-team/user/:teamId?/:userId?"
            component={ViewTeam}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Routes;
