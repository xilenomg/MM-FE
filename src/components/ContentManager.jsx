import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import FormSearch from "./Forms/FormSearch/FormSearch.jsx";
import "./ContentManager.scss";

const ContentManager = () => 
  <div className="ContentManager">
    <Router>
      <Switch>
        <Route path="/" component={FormSearch} />
      </Switch>
    </Router>
  </div>
;

export default ContentManager;