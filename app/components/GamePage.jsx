import React from 'react';
import { Link } from 'react-router-dom';
var sentiment = require('sentiment');

export default class GamePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: [],
      reviews: [],
      summary: "",
      recommendedTitles: [],
      score_avg: 0,

	  comparative_avg: 0,
    }
    this.setRecommendedTitles = this.setRecommendedTitles.bind(this);
    this.setSummary = this.setSummary.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.props.match.params.title
    this.componentDidMount()
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

  componentDidMount(){
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
  renderWordList(words){
    var value;
    var sortable = [];
    Object.entries(words).sort().forEach(function(entry) {
        sortable.push(entry);
    });
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });
    console.log("sortable", sortable);

    const listItems = sortable.map((word, i) => {
      if(i >= 10){
        return
      }
			return  <div>
      					{i+1}. {word[0]} - {word[1]}
    				  </div>

      }
    );
    return listItems;
  }


  getSentimentData(){
  	var reviews = this.state.reviews;
  	var score_avg = 0;
  	var comparative_avg = 0;
  	var total_rev = 0;
    var positive = {};
    var negative = {};
  	for (var i = 0; i < reviews.length; i++) {
  		if((i + 1) % 4 == 0){
        var sentiment_data = sentiment(reviews[i]);
  			score_avg += sentiment_data.score;
  			comparative_avg += sentiment_data.comparative;
  			total_rev = (i+1)/4;

        //positive values
        for(var j = 0; j < sentiment_data.positive.length; j++){
          var key = sentiment_data.positive[j];
          if(!positive.hasOwnProperty(key)){
            positive[key] = 1;
          }
          else{
            positive[key] += 1;
          }
        }

        //positive values
        for(var j = 0; j < sentiment_data.negative.length; j++){
          var key = sentiment_data.negative[j];
          if(!positive.hasOwnProperty(key)){
            negative[key] = 1;
          }
          else{
            negative[key] += 1;
          }
        }


  		}

  	}
    console.log(positive);
    console.log(negative);

  	score_avg = score_avg/total_rev;
  	comparative_avg = comparative_avg/total_rev;


  	return ([score_avg, comparative_avg, positive, negative]);
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

  renderTitleLinks(){
    //var ranked_titles = this.rankTitles();
    if(this.state.recommendedTitles.length == 0){
        return <h4>no similar games founded</h4>
    }
    const listItems = this.state.recommendedTitles.map((title) =>
      <Link to={"/game/" + title} class="game_link">{title}<br/></Link>
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
        var games = [];

        for (var i = 0; i < docs.length; i++) {
          var target = docs[i].summary[0];
          var t = docs[i].title[0];
          var res = stringSimilarity.compareTwoStrings(source, target);
          if(res >= 0.55 && this.state.title != t){
              console.log(docs[i].title[0] + res);
//              titles.push(docs[i].title[0]);
              var game = new Object();
              game.name = docs[i].title[0];
              game.score = res;
              games.push(game);
              
//              num++;
//              if(num > 5) break;
          }
        }
        games.sort(function(a,b){
            if(a.score > b.score){
                return -1;
            }
            return 1;
        });
        for(var i = 0; i < games.length && i < 10; i++){
            titles.push(games[i].name);
        }
        this.setRecommendedTitles(titles);
//        console.log(titles);
     })
     .catch((error) => {
        console.error(error);
      });
}



  render() {
    return (
      <div class="gamepage">
      <h1>{this.state.title}</h1>

      <h2>Sentiment Analysis Results</h2>
      <div class="data">
    	  Average Score: {this.getSentimentData()[0]}
    	  <br/>
    	  Average Comparative: {this.getSentimentData()[1]}

        <h3>Top Positive Words</h3>
        {this.renderWordList(this.getSentimentData()[2])}

        <h3>Top Negative Words</h3>
        {this.renderWordList(this.getSentimentData()[3])}



          <h3>Top Recommendations</h3>
          {this.renderTitleLinks()}
        </div>
      </div>
    );
  }
}
