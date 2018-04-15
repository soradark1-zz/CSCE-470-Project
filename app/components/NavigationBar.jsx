import React from 'react';
import '../styles/NavigationBar.scss';
import { Link, Redirect } from 'react-router-dom';
//https://gist.github.com/wassname/6bd1d58a31afbf960cbd35e3fc92be5a

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


  updateURL(event){
    event.preventDefault()
    var query = event.target.value;
    this.props.setQuery(query); //http://localhost:8983/solr/ps4_games/select?fl=title,id&q=title:Kingdom
    var url = 'http://localhost:8983/solr/ps4_games/select?fl=title,id&q=title:' + this.props.formatQuery(query) + '&rows=20'

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
