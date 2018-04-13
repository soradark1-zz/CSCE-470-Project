import React from 'react';
import { Link } from 'react-router-dom';
import TfIdf from 'natural/lib/natural/tfidf/tfidf.js';

export default class IndexPage extends React.Component {
  constructor(props) {
    super(props);

  }

  renderTitleLinks(){
    var ranked_titles = this.rankTitles();
    const listItems = ranked_titles.map((title) =>
      <Link to={"/game/" + title[1]}>{title[1]}</Link>
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
    console.log(ranked_titles.sort().reverse());
    return ranked_titles;
  }

  render() {

    return (
      <div>
      <h1>Results Page</h1>
      {console.log("Index Props",this.props)}
      <div className="result-list">
        {this.renderTitleLinks()}
      </div>
      </div>
    );
  }
}
