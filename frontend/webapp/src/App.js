import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Auth } from "aws-amplify";
import {withAuthenticator} from '@aws-amplify/ui-react';

// Instead of using Bootstrap with
// `import 'bootstrap/dist/css/bootstrap.min.css';`
// We use the customized Bootstrap css. See  comments in "src/custom-bootstrap/scss/custom.scss" for details.
import './custom-bootstrap/css/custom.css'
import 'open-iconic/font/css/open-iconic-bootstrap.css';

import config from "./config";

import { DemoContainer } from './components/layouts/DemoContainer';
import Header from "./components/Header";
import { Footer } from "./components/Footer";

import "./App.scss";
import Routes from "./Routes";


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated : false,
      authenticatedUserName : '',
    };
  }

  async componentDidMount() {
    try {
      const session = await Auth.currentSession();
      if (session) {
        this.userHasAuthenticated(session.accessToken.payload.username);
      }
    } catch (e) {
      if (e !== 'No current user') {
        console.warn(e);
      }
    }
  }

  userHasAuthenticated = username => {
    const isAuthenticated = !!username;

    this.setState({
      isAuthenticated : isAuthenticated,
      authenticatedUserName : username
    });
  };


  handleLogout = async () => {
    await Auth.signOut();

    this.userHasAuthenticated(false);

    this.props.history.push("/login");
  };

  render() {
    const childProps = {
      isAuthenticated : this.state.isAuthenticated,
      userHasAuthenticated : this.userHasAuthenticated,
      authenticatedUserName : this.state.authenticatedUserName,
    };

    const menu = [
      {
        text: "Train new model",
        href: "/",
      },
      {
        text: "Predict",
        href: "infer",
      },
    ];

    return (
      <DemoContainer bgType='light'>
        {this.state.isAuthenticated && <Header loginName={this.state.authenticatedUserName || ''}
                                               logoHeight={35}
                                               customerName={config.HEADER_TITLE}
                                               customerLogoUrl={config.HEADER_LOGO}
                                               onLogout={this.handleLogout}
                                               menu={menu}
        />
        }
        <Routes childProps={childProps}/>
        <Footer />
      </DemoContainer>
    );
  }

}

export default withAuthenticator(withRouter(App));
