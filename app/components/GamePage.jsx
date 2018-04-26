import React from 'react';
import { Link } from 'react-router-dom';
import LevenshteinDistance from 'natural/lib/natural/distance/levenshtein_distance';

export default class GamePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: [],
      reviews: [],
      summary: "",
      recommendedTitles: []
    }
    this.setRecommendedTitles = this.setRecommendedTitles.bind(this);
    this.setSummary = this.setSummary.bind(this);
  }
    
  setRecommendedTitles(titles){
    this.setState({
      recommendedTitles: titles
    })
  }
    
  setSummary(summary){
    this.setState({
      summary : summary
    })
  }

  componentWillMount(){
    var query = this.props.match.params.title;
    var url = 'http://localhost:8983/solr/ps4_games/select?q=title:' + this.props.formatQuery(query) + '&rows=1'

    fetch(url)
     .then((response) => response.json())
     .then((responseJson) => {
       console.log("Game Page", responseJson.response.docs[0]);
       this.setState(responseJson.response.docs[0]);
//       this.setSummary(responseJson.response.docs[0].summary[0]);
        this.findSimilar2();
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
    
  renderTitleLinks(){
    //var ranked_titles = this.rankTitles();
    const listItems = this.state.recommendedTitles.map((title) =>
      <Link to={"/game/" + title}>{title}</Link>
    );
    console.log(listItems);
    return listItems;
  }
    
findSimilar2(){
    var stringSimilarity = require('string-similarity');
    var source = String(this.state.summary);
    var url = 'http://localhost:8983/solr/ps4_games/select?fl=title,summary&q=*:*&rows=1516'
    var num = 0;
    let titles = [];
    fetch(url)
     .then((response) => response.json())
     .then((responseJson) => {
        var docs = responseJson.response.docs;
        
        for (var i = 0; i < docs.length && num <= 5; i++) {
          var target = docs[i].summary[0];
          var res = stringSimilarity.compareTwoStrings(source, target);
          if(res >= 0.17){
              console.log(docs[i].title[0] + res);
              titles.push(docs[i].title[0]);
              num++;
              if(num > 5) break;
          }
        }
        this.setRecommendedTitles(titles);
//        console.log(titles);
     })
     .catch((error) => {
        console.error(error);
      });
} 



  render() {
    {console.log(this.state)}
    return (
      <div>
      <h1>{this.state.title}</h1>
      <div>{this.renderReviews()}</div>
      <div>{this.renderTitleLinks()}</div>
      </div>
    );
  }
}
