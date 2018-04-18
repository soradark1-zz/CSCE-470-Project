import React from 'react';
import { Link } from 'react-router-dom';
import TfIdf from 'natural/lib/natural/tfidf/tfidf.js';
import LevenshteinDistance from 'natural/lib/natural/distance/levenshtein_distance';

export default class RecommendationPage extends React.Component {
  constructor(props) {
    super(props);

  }

  renderTitleLinks(){
    //var ranked_titles = this.rankTitles();
    this.findSimilar2();  
    const listItems = this.props.titles.map((title) =>
      <Link to={"/game/" + title}>{title}</Link>
    );
    return listItems;
  }

  findSimilar(){
//    var LevenshteinDistance = new LevenshteinDistance();
    var source = this.props.titles[0];
    var url = 'http://localhost:8983/solr/ps4_games/select?fl=title,summary&q=*:*&rows=1516'
    var num = 0;
    fetch(url)
     .then((response) => response.json())
     .then((responseJson) => {
//       console.log( responseJson.response.docs);
//       this.props.setMyJSON(responseJson.response.docs);
//       let titles = this.getTitles(this.props.myjson)
//       let summary = this.getSummary(this.props.myjson)
//       this.props.setSummary(summary)
//       this.props.setTitles(titles);
//       let ids = this.getIds(this.props.myjson)
//       this.props.setDocIDs(ids);
//       this.props.history.push(`/recommendation`)
        var docs = responseJson.response.docs;
        
        for (var i = 0; i < docs.length && num <= 5; i++) {
          var target = docs[i].summary[0];
          var res = LevenshteinDistance.LevenshteinDistance(source, target, {search: true});
          if(res.distance <= 7){
              console.log(res);
              console.log("num: " + num);
              num++;
          }
        }
//        var source = 'The RainCoat BookStore';
//        var target = 'All the best books are here at the Rain Coats Book Store';
//
//        console.log(LevenshteinDistance.LevenshteinDistance(source, target, {search: true}));
       return responseJson
     })
     .catch((error) => {
        console.error(error);
      });
  }      
    
   findSimilar2(){
    var stringSimilarity = require('string-similarity');
    var source = this.props.summary;
    var url = 'http://localhost:8983/solr/ps4_games/select?fl=title,summary&q=*:*&rows=1516'
    var num = 0;
    let titles = [];
    fetch(url)
     .then((response) => response.json())
     .then((responseJson) => {
        var docs = responseJson.response.docs;
        
        for (var i = 0; i < docs.length && num <= 5; i++) {
          var target = docs[i].summary;
          var res = stringSimilarity.compareTwoStrings(source, target);
//            console.log(res);
          if(res >= 0.17){
              console.log(docs[i].title[0] + res);
              titles.push(docs[i].title[0]);
              num++;
              if(num > 5) break;
          }
        }
        this.props.setTitles(titles);
        
//        return this.renderTitleLinks();
        
       return responseJson;
     })
     .catch((error) => {
        console.error(error);
      });
   } 

  render() {

    return (
      <div>
      <h1>Recommendation Page</h1>
      {console.log("Index Props",this.props)}
      <div className="recommendation-list">
        {this.renderTitleLinks()}
      </div>
      </div>
    );
  }
}
