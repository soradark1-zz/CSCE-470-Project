import React from 'react';
import PathLoader from 'path-loader'

export default class IndexPage extends React.Component {

  componentDidMount(){
    fetch('https://facebook.github.io/react-native/movies.json')
   .then((response) => response.json())
   .then((responseJson) => {
     console.log( responseJson.movies);
   })
  }

  render() {
    return (
      <h1>Home Page</h1>
    );
  }
}
