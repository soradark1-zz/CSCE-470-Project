import React from 'react';

export default class IndexPage extends React.Component {

  componentDidMount(){
    fetch('http://localhost:8983/solr/ps4_games/select?fl=title&q=title:%22Kingdom%22')
   .then((response) => response.json())
   .then((responseJson) => {
     console.log( responseJson);
   })
   .catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <h1>Home Page</h1>
    );
  }
}
