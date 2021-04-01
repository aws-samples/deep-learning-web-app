import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Footer.scss';
import { Themes } from "./constants/Themes";

export class Footer extends Component {

  render() {

    let {theme} = this.props;

    if (!theme) {
      theme = 'light';
    }

    return (
      <footer className={"spd-footer px-3 py-2 " + theme}>
        <small className="spd-footer__legal">© 2020, Amazon Web Services, Inc. or its affiliates. All rights reserved.</small>

        {/* Divide left and right alignment*/}
        <div className="spd-footer__filler"/>

        <div className="spd-footer__logo" />

      </footer>
    )
  }

}

Footer.propTypes = {
  theme : PropTypes.oneOf([Themes.LIGHT, Themes.DARK])
};
