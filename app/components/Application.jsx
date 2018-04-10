import React from 'react';

import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';

import NavigationBar from './NavigationBar.jsx';

// Load pages for routing
import AboutPage from './AboutPage.jsx';
import IndexPage from './IndexPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';

// Normalize styling across all browsers
import 'normalize.css/normalize.css';

// Use the main stylesheet
import '../styles/Application.scss';

export default class Application extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div id="app">
          <NavigationBar />
          <Switch>
              <Route exact path="/" component={IndexPage}/>
              <Route exact path="/about" component={AboutPage}/>
              <Route component={NotFoundPage} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
