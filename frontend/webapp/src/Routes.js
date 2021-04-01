import React from "react";
import { Route, Switch } from "react-router-dom";
import InferencePage from "./containers/InferencePage";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import TrainModelPage from "./containers/TrainModelPage/TrainModelPage";

export default ({ childProps }) =>
  <Switch>
    <AuthenticatedRoute path="/" exact component={TrainModelPage} props={childProps}/>
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps}/>
    <AuthenticatedRoute path="/infer" exact component={InferencePage} props={childProps}/>
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;


