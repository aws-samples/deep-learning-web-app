import React, { Component } from 'react';
import "./BouncingLoader.scss";

class BouncingLoader extends Component {
  render() {
    return (
      <div className="bouncing-loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  }
}


export default BouncingLoader;
