import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import logo from './logo.svg';
import './App.css';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import JobPosting from './pages/JobPosting';
import Posts from './pages/Posts';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apiMessage: 'Not yet available'
    };
  }

  async componentDidMount() {
    const data = await this.fetchWelcomeMessage();
    this.setState(prev => ({ ...prev, apiMessage: data.message }));
  }

  async fetchWelcomeMessage() {
    try {
      const res = await fetch('/api/v1');
      return res.json();
    } catch (error) {
      console.log(error);
    }
  }
  render() {
    return (
      <div className='App'>
        <Switch>
          <Route exact path='/' render={() => (
            <header className='App-header'>
              <img src={logo} className='App-logo' alt='logo' />
              <div className='message'>{ this.state.apiMessage }</div>
            </header>
          )} />
          <Route path='/signup' component={SignUp} />
          <Route path='/login' component={Login} />
          <Route exact path='/jobs' component={JobPosting} />
          <Route path='/jobs/posts' component={Posts} />
        </Switch>
      </div>
    );
  }
}

export default App;
