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
import SearchBar from './SearchBar.jsx';

// Load pages for routing
import AboutPage from './AboutPage.jsx';
import GamePage from './GamePage.jsx';
import IndexPage from './IndexPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import ResultsPage from './ResultsPage.jsx';
//import RecommendationPage from './RecommendationPage.jsx'
var RegexpTokenizer = require('natural/lib/natural/tokenizers/regexp_tokenizer').RegexpTokenizer;

// Normalize styling across all browsers
import 'normalize.css/normalize.css';

// Use the main stylesheet
import '../styles/Application.scss';

import background from '../images/page_background.jpg';



export default class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      formated_query: "",
      myjson: {},
      titles: [],
      doc_ids: [],
      summary: "",
    };
    this.setMyJSON = this.setMyJSON.bind(this);
    this.setTitles = this.setTitles.bind(this);
    this.setQuery = this.setQuery.bind(this);
    this.setDocIDs = this.setDocIDs.bind(this);
    this.formatQuery = this.formatQuery.bind(this);
    this.setSummary = this.setSummary.bind(this);
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
    
  setSummary(summary){
    this.setState({
      summary: summary
    })
  }
    

  formatQuery(query){
    var regexp = new RegexpTokenizer({pattern: /[^A-Za-zА-Яа-я0-9_']+/});
    var tokens = regexp.tokenize(query);
    var new_query = "";
    for (var i = 0; i < tokens.length; i++) {
      new_query += tokens[i];
      if (i != tokens.length-1) {
        new_query += "%2B";
      }
    }
    return new_query;
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
              setSummary={this.setSummary}

              formatQuery={this.formatQuery}
              {...props}
              />
            )}/>
            
          
          {console.log("Application state", this.state)}
          <div class="switch_pages">
          <Switch>
              <Route exact path="/" component={IndexPage}/>
              <Route exact path="/results" render={(props) => (
                <ResultsPage
                  titles={this.state.titles}
                  query={this.state.query}
                  doc_ids={this.state.doc_ids}
                  setTitles={this.setTitles}
                  setSummary={this.setSummary}
                  setQuery={this.setQuery}
                  setDocIDs={this.setDocIDs}
                  {...props}
                />
              )}/>
              
              <Route exact path="/recommendation" render={(props) => (
                <RecommendationPage
                  titles={this.state.titles}
                  query={this.state.query}
                  doc_ids={this.state.doc_ids}
                  setTitles={this.setTitles}
                  setSummary={this.setSummary}
                  setQuery={this.setQuery}
                  setDocIDs={this.setDocIDs}
                  {...props}
                />
              )}/>

              <Route path="/game/:title" render={(props) => (
                <GamePage
                  formatQuery={this.formatQuery}
                  {...props}
                />
              )}/>
              <Route exact path="/about" component={AboutPage}/>
              <Route component={NotFoundPage} />
          </Switch>
          </div>
        </div>
      </HashRouter>
    );
  }
}
