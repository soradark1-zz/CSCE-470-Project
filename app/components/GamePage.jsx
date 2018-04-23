import React from 'react';
import { Link } from 'react-router-dom';

export default class GamePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: [],
      reviews: [],
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
  
  renderscore(resultscore){
	  console.log(resultscore);
	  return <div><br/>{"Sentiment:"} {resultscore}</div>
  }
  
  rendersentiment(){
	'use strict';

	let https = require ('https');


	let accessKey = 'a19ee40ac1674a068e6325b8034055d6';
	var reviews = this.state.reviews;
	var reviewtext = "";
	var resultscore = 0;
	reviews.map((reviews, i) => {
		if((i+1) % 4 == 0 && i < 40){
		   reviewtext += reviews;
		}
	  }
	);
	
	const requestBody = {
		  "documents": [
			{
			  "language": "en",
			  "id": "1",
			  "text": reviewtext,
			}
		  ]
		};
		
	
		  const request = new XMLHttpRequest();
		  request.open('POST', 'https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment', true);
		  request.setRequestHeader("Content-Type", "application/json");
		  request.setRequestHeader("Ocp-Apim-Subscription-Key", "a19ee40ac1674a068e6325b8034055d6"); // Set API key.
		  request.setRequestHeader("Accept","application/json");
		  request.onload = () => {
			let body_ = JSON.parse (request.responseText);
			let body__ = JSON.stringify (body_, null, '  ');
			
			console.log (body__);
			if(JSON.parse(request.responseText).documents.length !=0){
				
				resultscore = JSON.parse(request.responseText).documents[0].score*100;
				console.log(resultscore);
				this.renderscore(resultscore);
//				return <div><br/>{"Sentiment:"} {resultscore}</div>
			}
		  };
		  request.onerror = () => {
			alert(request.responseText);
		  };
		  request.send(JSON.stringify(requestBody));


  }
  
  
 


  render() {
    {console.log(this.state)}
    return (
      <div>
      <h1>{this.state.title}</h1>
	  {this.rendersentiment()}	  
      {this.renderReviews()}
      </div>
    );
  }
}
