import React from 'react';
import { Link } from 'react-router-dom';

export default class IndexPage extends React.Component {
  constructor(props) {
    super(props);

  }


  render() {

    return (
      <div>
      <h1>{this.props.match.params.title}</h1>
      {console.log(this.props)}
      </div>
    );
  }
}
