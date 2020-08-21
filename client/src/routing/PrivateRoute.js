import React from "react";
import { Redirect, Route } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const PrivateRoute = props => {
  // redux state
  const { isAuthenticated } = props;

  // passed props
  const { component: Component, ...rest } = props;

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <Route
      {...rest}
      render={props => <Component {...props} />}
    />
  );
};

const { bool } = PropTypes;

PrivateRoute.defaultProps = {
  isAuthenticated: false
};

PrivateRoute.propTypes = {
  isAuthenticated: bool
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated
});

export default connect(mapStateToProps)(PrivateRoute);
