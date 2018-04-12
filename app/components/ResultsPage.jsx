import React from 'react';
import { Link } from 'react-router-dom';

export default class IndexPage extends React.Component {
  constructor(props) {
    super(props);

  }

  renderTitleLinks(){
    console.log('render', this.props.titles)
    const listItems = this.props.titles.map((title) =>
      <Link to={"/" + title}>{title}</Link>
    );
    return listItems;
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
