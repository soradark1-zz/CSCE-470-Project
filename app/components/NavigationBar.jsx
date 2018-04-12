import React from 'react';
import '../styles/NavigationBar.scss';
import { Link, Redirect } from 'react-router-dom';

export default class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    }
  }

  submitInput(e){
    e.preventDefault()
    this.setState({ redirect: true })
  }





  getTitles(docs){
    let titles = []
    for (var i = 0; i < docs.length; i++) {
      titles.push(docs[i].title[0]);
    }
    return titles;
  }

  updateURL(event){
    event.preventDefault()
    var query = event.target.value;
    this.props.setQuery(query);
    var url = 'http://localhost:8983/solr/ps4_games/select?fl=title&q=title:' + query + '*&rows=200'
    console.log(event.target.value)
    fetch(url)
     .then((response) => response.json())
     .then((responseJson) => {
       //console.log( responseJson.response.docs);
       this.props.setMyJSON(responseJson.response.docs);
       let titles = this.getTitles(this.props.myjson)
       this.props.setTitles(titles);
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
        {this.state.redirect && (
          <Redirect to='/'/>
        )}

      </div>
    );
  }
}
