import React from 'react';
import ReactDOM from 'react-dom';

// Load the main html file
import './index.html';

// Import the main "Application" component
import Application from './components/Application.jsx';

// Create an Application instance on the page
ReactDOM.render(<Application />, document.getElementById('root'));
