import React from 'react';
import '../styles/NavigationBar.scss';
import { Link } from 'react-router-dom';

export default class NavigationBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      myjson: {},
      titles: []
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.titles !== nextProps.titles) {
      return true;
    }
    return true;
  }



  componentDidMount(){
    return fetch('http://localhost:8983/solr/ps4_games/select?fl=title&q=title:*&rows=200')
     .then((response) => response.json())
     .then((responseJson) => {
       //console.log( responseJson.response.docs);
       this.props.setMyJSON(responseJson.response.docs);
       let titles = this.getTitles(this.props.myjson)
       this.props.setTitles(titles);
       this.setState({
         myjson: responseJson.response.docs,
         titles: titles
       });

       return responseJson
     })
     .catch((error) => {
        console.error(error);
      });
  }



  renderTitleLinks(){
    const listItems = this.state.titles.map((title) =>
      <Link to={"/" + title}>{title}</Link>
    );
    return listItems;
  }

  getTitles(docs){
    let titles = []
    for (var i = 0; i < docs.length; i++) {
      titles.push(docs[i].title[0]);
    }
    return titles;
  }

  updateURL(event){
    var url = 'http://localhost:8983/solr/ps4_games/select?fl=title&q=title:' + event.target.value + '*&rows=200'
    console.log(event.target.value)
    fetch(url)
     .then((response) => response.json())
     .then((responseJson) => {
       //console.log( responseJson.response.docs);
       this.props.setMyJSON(responseJson.response.docs);
       let titles = this.getTitles(this.props.myjson)
       this.props.setTitles(titles);
       this.setState({
         myjson: responseJson.response.docs,
         titles: titles
       });

       return responseJson
     })
     .catch((error) => {
        console.error(error);
      });
  }





  render() {
    return (
      <div className="navbar">
        <Link to="/">
          <h1>Home Page</h1>
        </Link>
        <Link to="/about">
          <h1>About Page</h1>
        </Link>
        <input
          type="text"
          placeholder="Search"
          onChange={this.updateURL.bind(this)}
        >
        </input>
      </div>
    );
  }
}
