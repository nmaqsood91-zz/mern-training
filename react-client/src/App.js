import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './redux/store';

import Navbar from './Nav';
import Landing from './Landing';
import Register from './Register';
import Login from './Login';

import './index.css';


class App extends Component {
  render() {
    return (
      <Provider store={store}>
      <div>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
            </div>
          </div>
        </Router>
      </div>
        
      </Provider>
    );
  }
}

export default App;
