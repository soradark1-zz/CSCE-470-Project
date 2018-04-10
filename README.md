# Web App

## Project Structure

- **app/** contains all the code, styles, and assets
  - **components/** houses all react components, one per file
  - **images/** contains all images, SVG preferred
  - **styles/** contains all [SCSS] stylesheets
  - **index.html** is the single html file, dynamically changed
  - **index.jsx** is the entry-point of the application
- **.babelrc** configures the JavaScript transpiler which understands JSX
- **.gitignore** ignores sensitive or unshared files
- **package.json** declares all dependencies and scripts
- **webpack.common.js** contains shared [webpack] logic
- **webpack.dev.js** contains development-only [webpack] logic
- **webpack.prod.js** contains production-only [webpack] logic

## Setup a Development Environment

- **Install the latest [Node.js]**
- **Clone the directory by running `git clone git@github.com:indieaux/web.git`**
- **Navigate into the cloned directory and run `npm install` to install all the required dependencies**
- **Start the development server by running `npm start` and stop the server using `Ctrl-C`**
