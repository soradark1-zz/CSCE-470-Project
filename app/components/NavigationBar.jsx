import React from 'react';
import '../styles/NavigationBar.scss';
import { Link } from 'react-router-dom';

export default class NavigationBar extends React.Component {
  render() {
    return (
      <div className="navbar">
        <Link to="/">
          <h1>Home Page</h1>
        </Link>
        <Link to="/about">
          <h1>About Page</h1>
        </Link>
        <input
          type="text"
          placeholder="Search"
        >
        </input>
      </div>
    );
  }
}
