import React from "react";

import { OneColumnLayout } from '../components'

import "./NotFound.scss";

export default function NotFound() {
  return <OneColumnLayout>
    <div className="not-found">
      <h3>Sorry, page not found!</h3>
    </div>
  </OneColumnLayout>;
}
