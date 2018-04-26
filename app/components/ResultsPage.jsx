import React from 'react';
import { Link } from 'react-router-dom';
import TfIdf from 'natural/lib/natural/tfidf/tfidf.js';

export default class ResultsPage extends React.Component {
  constructor(props) {
    super(props);

  }

  renderTitleLinks(){
    //var ranked_titles = this.rankTitles();
    const listItems = this.props.titles.map((title) =>
      <Link
       to={"/game/" + title}
       class="game_link"
       >
        {title}
      </Link>
    );
    return listItems;
  }

  rankTitles(){
    var tfidf = new TfIdf();
    var titles = this.props.titles;
    for (var i = 0; i < this.props.titles.length; i++) {
      tfidf.addDocument(this.props.titles[i]);
    }
    var ranked_titles = [];
    tfidf.tfidfs(this.props.query, function(i, measure) {
        console.log('document #' + i + ' is ' + measure);
        ranked_titles.push([measure, titles[i]]);
    });
    console.log('ranked', ranked_titles.sort().reverse());
    return ranked_titles;
  }

  render() {

    return (
      <div class="resultpage">
      <h1>Results</h1>
      {console.log("Index Props",this.props)}
      <div className="result-list">
        {this.renderTitleLinks()}
      </div>
      </div>
    );
  }
}
