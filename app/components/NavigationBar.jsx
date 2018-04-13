import React from 'react';
import '../styles/NavigationBar.scss';
import { Link, Redirect } from 'react-router-dom';
//https://gist.github.com/wassname/6bd1d58a31afbf960cbd35e3fc92be5a
var WordTokenizer = require('natural/lib/natural/tokenizers/regexp_tokenizer').WordTokenizer;
var RegexpTokenizer = require('natural/lib/natural/tokenizers/regexp_tokenizer').RegexpTokenizer;

export default class NavigationBar extends React.Component {
  constructor(props) {
    super(props);

  }


  getTitles(docs){
    let titles = []
    for (var i = 0; i < docs.length; i++) {
      titles.push(docs[i].title[0]);
    }
    return titles;
  }
  getIds(docs){
    let ids = []
    for (var i = 0; i < docs.length; i++) {
      ids.push(docs[i].id);
    }
    return ids;
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

  updateURL(event){
    event.preventDefault()
    var query = event.target.value;
    this.props.setQuery(query); //http://localhost:8983/solr/ps4_games/select?fl=title,id&q=title:Kingdom
    var url = 'http://localhost:8983/solr/ps4_games/select?fl=title,id&q=title:' + this.formatQuery(query) + '&rows=200'

    var tokenizer = new WordTokenizer();
    var regexp = new RegexpTokenizer({pattern: /[^A-Za-zА-Яа-я0-9_']+/});

    console.log("token", tokenizer.tokenize(event.target.value))
    console.log("token2", regexp.tokenize(event.target.value))
    console.log("token2format", this.formatQuery(query))
    fetch(url)
     .then((response) => response.json())
     .then((responseJson) => {
       //console.log( responseJson.response.docs);
       this.props.setMyJSON(responseJson.response.docs);
       let titles = this.getTitles(this.props.myjson)
       this.props.setTitles(titles);
       let ids = this.getIds(this.props.myjson)
       this.props.setDocIDs(ids);
       this.props.history.push(`/results`)
       return responseJson
     })
     .catch((error) => {
        console.error(error);
      });
  }







  render() {
    return (
      <div className="navbar">
      {console.log("Nav Props",this.props)}
        <Link to="/">
          <h1>Home Page</h1>
        </Link>
        <Link to="/about">
          <h1>About Page</h1>
        </Link>
        <input
          type="text"
          placeholder="Search"
          value={this.props.query}
          onChange={this.updateURL.bind(this)}
        >
        </input>


      </div>
    );
  }
}
