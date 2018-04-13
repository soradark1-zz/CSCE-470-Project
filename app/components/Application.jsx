import React from 'react';

import {
  BrowserRouter,
  Route,
  Switch,
  browserHistory,
  hashHistory,
  HashRouter
} from 'react-router-dom';

import NavigationBar from './NavigationBar.jsx';

// Load pages for routing
import AboutPage from './AboutPage.jsx';
import GamePage from './GamePage.jsx';
import IndexPage from './IndexPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import ResultsPage from './ResultsPage.jsx';

// Normalize styling across all browsers
import 'normalize.css/normalize.css';

// Use the main stylesheet
import '../styles/Application.scss';

export default class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      myjson: {},
      titles: [],
      doc_ids: []
    };
    this.setMyJSON = this.setMyJSON.bind(this);
    this.setTitles = this.setTitles.bind(this);
    this.setQuery = this.setQuery.bind(this);
    this.setDocIDs = this.setDocIDs.bind(this);
  }

  setQuery(query){
    this.setState({
      query: query
    })
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

  setDocIDs(doc_ids){
    this.setState({
      doc_ids: doc_ids
    })
  }

  render() {
    return (
      <HashRouter>
        <div id="app">
          <Route render={(props) => (
            <NavigationBar
              myjson={this.state.myjson}
              titles={this.state.titles}
              query={this.state.query}
              doc_ids={this.state.doc_ids}
              setTitles={this.setTitles}
              setMyJSON={this.setMyJSON}
              setQuery={this.setQuery}
              setDocIDs={this.setDocIDs}
              {...props}
              />
            )}/>
          {console.log("Application state", this.state)}
          <Switch>
              <Route exact path="/" component={IndexPage}/>
              <Route exact path="/results" render={(props) => (
                <ResultsPage
                  myjson={this.state.myjson}
                  titles={this.state.titles}
                  query={this.state.query}
                  setTitles={this.setTitles}
                  setMyJSON={this.setMyJSON}
                  setQuery={this.setQuery}
                  {...props}
                />
              )}/>
              <Route exact path="/results" render={(props) => (
                <ResultsPage
                  myjson={this.state.myjson}
                  titles={this.state.titles}
                  query={this.state.query}
                  setTitles={this.setTitles}
                  setMyJSON={this.setMyJSON}
                  setQuery={this.setQuery}
                  {...props}
                />
              )}/>
              <Route path="/game/:title" render={(props) => (
                <GamePage
                  myjson={this.state.myjson}
                  titles={this.state.titles}
                  query={this.state.query}
                  setTitles={this.setTitles}
                  setMyJSON={this.setMyJSON}
                  setQuery={this.setQuery}
                  {...props}
                />
              )}/>
              <Route exact path="/about" component={AboutPage}/>
              <Route component={NotFoundPage} />
          </Switch>
        </div>
      </HashRouter>
    );
  }
}
