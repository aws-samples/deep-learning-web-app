import React, { Component } from "react";
import PropTypes from 'prop-types';

import { Auth } from "aws-amplify";
import {
  OneColumnLayout,
  LoginForm
} from "../components";

export default class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading : false
    };
  }

  async confirmNewPassword(signInResponse, password) {
    console.log('This is the first time this user logs in. The user requires changing (or confirming) password');
    console.log('Auto-confirm user password');
    await Auth.completeNewPassword(
      signInResponse,
      password,
      signInResponse.challengeParam.requiredAttributes
    );
    console.log("Auth.completeNewPassword succeeded");
  }

  handleSubmit = async (username, password) => {
    this.setState({isLoading : true});

    try {
      const signInResponse = await Auth.signIn(username, password);
      if(signInResponse.challengeName === "NEW_PASSWORD_REQUIRED"){
        await this.confirmNewPassword(signInResponse, password);
      }
      this.props.userHasAuthenticated(signInResponse.username);
      this.props.history.push("/");
    } catch (e) {
      alert(e.message);
      this.setState({isLoading : false});
    }
  };

  render() {
    return (
      <OneColumnLayout>
        <LoginForm
          isLoading={this.state.isLoading}
          onSubmit={this.handleSubmit}
        />
      </OneColumnLayout>
    );
  }
}

Login.propTypes = {
  userHasAuthenticated : PropTypes.func
};
