import React from 'react';
import { Link } from 'react-router-dom';

export default class GamePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: [],
      reviews: []
    }
  }

  componentWillMount(){
    var query = this.props.match.params.title;
    var url = 'http://localhost:8983/solr/ps4_games/select?q=title:' + this.props.formatQuery(query) + '&rows=1'

    fetch(url)
     .then((response) => response.json())
     .then((responseJson) => {
       console.log("Game Page", responseJson.response.docs[0]);
       this.setState(responseJson.response.docs[0]);
       return responseJson
     })
     .catch((error) => {
        console.error(error);
      });
  }

  renderReviews(){
    var reviews = this.state.reviews;
    const listItems = reviews.map((reviews, i) => {
        if((i + 1) % 4 == 0){
           return <div><br/>{(i+1) / 4} {reviews}</div>
        }
      }
    );
    return listItems;
  }



  render() {
    {console.log(this.state)}
    return (
      <div>
      <h1>{this.state.title}</h1>
      {this.renderReviews()}

      </div>
    );
  }
}
