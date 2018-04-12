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
  constructor(props) {
    super(props);
    this.state = {
      serach_url: "",
      myjson: {},
      titles: []
    };
    this.setMyJSON = this.setMyJSON.bind(this);
    this.setTitles = this.setTitles.bind(this);
  }

  setMyJSON(myjson){
    this.setState({
      myjson: myjson
    })
  }

  setTitles(titles){
    this.setState({
      titles: titles
    })
  }

  render() {
    return (
      <BrowserRouter>
        <div id="app">
          <NavigationBar
            myjson={this.state.myjson}
            title={this.state.titles}
            setMyJSON={this.setMyJSON}
            setTitles={this.setTitles}
          />
          {console.log("Application state", this.state)}
          <Switch>
              <Route exact path="/" render={(props) => (
                <IndexPage
                  myjson={this.state.myjson}
                  title={this.state.titles}
                  setMyJSON={this.setMyJSON}
                  setTitles={this.setTitles}
                  {...props}
                />
              )}/>
              <Route exact path="/about" component={AboutPage}/>
              <Route component={NotFoundPage} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
