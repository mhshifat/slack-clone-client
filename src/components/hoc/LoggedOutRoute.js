import React from "react";
import { Redirect, Route } from "react-router-dom";
import isAuthenticated from "../../utils/isAuthenticated";

const LoggedOutRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Redirect to="/view-team" />
      ) : (
        <Component {...props} />
      )
    }
  />
);

export default LoggedOutRoute;
