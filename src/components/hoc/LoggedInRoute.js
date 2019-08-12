import React from "react";
import { Redirect, Route } from "react-router-dom";
import isAuthenticated from "../../utils/isAuthenticated";

const LoggedInRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? <Component {...props} /> : <Redirect to="/login" />
    }
  />
);

export default LoggedInRoute;
