import React from 'react';
import { Link } from 'react-router-dom';

export default class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myjson: {},
      titles: []
    };
  }


  componentDidMount(){
    return fetch('http://localhost:8983/solr/ps4_games/select?fl=title&q=title:%22batman%22')
     .then((response) => response.json())
     .then((responseJson) => {
       console.log( responseJson.response.docs[0]);
       let titles = this.getTitles(responseJson.response.docs)
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
      <Link to="/">{title}</Link>
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



  render() {

    return (
      <div>
      <h1>Home Page</h1>
      {console.log(this.state.titles)}
      {console.log("Props",this.props)}
      <div className="result-list">
        {this.renderTitleLinks()}
      </div>
      </div>
    );
  }
}
