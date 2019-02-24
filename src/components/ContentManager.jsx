import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import FormSearch from './Forms/FormSearch/FormSearch.jsx';
import './ContentManager.scss'

export default () => (
  <div className="ContentManager">
    <Router>
      <Switch>
        <Route path="/" component={FormSearch} />
      </Switch>
    </Router>
  </div>
);
