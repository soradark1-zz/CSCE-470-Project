import React from 'react';
import { Link } from 'react-router-dom';
var sentiment = require('sentiment');

export default class GamePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: [],
      reviews: [],
	  score_avg: 0,
	  comparative_avg: 0,
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

  getAverage(){
	var reviews = this.state.reviews;
	var score_avg = 0;
	var comparative_avg = 0;
	var total_rev = 0;
	for (var i = 0; i < reviews.length; i++) {
		if((i + 1) % 4 == 0){
			score_avg += sentiment(reviews[i]).score;
			comparative_avg += sentiment(reviews[i]).comparative;
			total_rev = (i+1)/4;
		}
	}
	score_avg = score_avg/total_rev;
	comparative_avg = comparative_avg/total_rev;

	return ([score_avg, comparative_avg]);
  }



  renderReviews(){
    var reviews = this.state.reviews;

    const listItems = reviews.map((reviews, i) => {
        if((i + 1) % 4 == 0){
			score_avg += sentiment(reviews).score;
			comparative_avg += sentiment(reviews).comparative;
			total_rev = (i+1) / 4;
			return  <div>
      					<br/>
      					{(i+1) / 4}

      					<br/>
      					Score: {sentiment(reviews).score}
      					<br/>
      					Comparative: {sentiment(reviews).comparative}
      					<br/>
      					{reviews}
    				  </div>
        }
      }
    );


    return listItems;
  }



  render() {
    return (
      <div class="gamepage">
      <h1>{this.state.title}</h1>

      <h2>Sentiment Analysis Results</h2>
      <div class="data">
    	  Average Score: {this.getAverage()[0]}
    	  <br/>
    	  Average Comparative: {this.getAverage()[1]}
      </div>

      </div>
    );
  }
}
