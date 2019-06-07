import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import './App.css';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Post from './pages/Post';
import JobPostings from './pages/JobPostings';
import JobApplicants from './pages/JobApplicants';
import NavBar from './components/NavBar';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apiMessage: 'Not yet available',
      loggedIn: false
    };

    this.handleToken = this.handleToken.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  async componentDidMount() {
    const data = await this.fetchWelcomeMessage();
    const loggedIn = localStorage.getItem('token') && localStorage.getItem('token') !== 'undefined';
    this.setState(prev => ({ ...prev, apiMessage: data.message, loggedIn }));
  }

  async fetchWelcomeMessage() {
    try {
      const res = await fetch('/api/v1');
      return res.json();
    } catch (error) {
      console.log(error);
    }
  }

  isLoggedIn() {
    const token = localStorage.getItem('token');
    const loggedIn = token && token !== 'undefined';
    return loggedIn;
  }

  handleToken() {
    this.setState({
      loggedIn: true
    });
  }

  handleLogout() {
    this.setState({
      loggedIn: false
    });
  }
  render() {
    const { loggedIn } = this.state;
    
    return (
      <div className='App'>
        <NavBar loggedIn={loggedIn} />
        <Switch>
          <Route exact path='/' render={() => (
            <header className='App-header'>
              <div className='message'>{ this.state.apiMessage }</div>
            </header>
          )} />
          <Route path='/signup' render={(props) => <SignUp {...props} handleToken={this.handleToken} />} />
          <Route path='/login' render={(props) => <Login {...props} handleToken={this.handleToken} />} />
          <Route path='/logout' render={(props) => <Logout {...props} handleLogout={this.handleLogout} />} />
          <Route exact path='/jobs/post' component={Post} />
          <Route exact path='/jobs' component={JobPostings} />
          <Route exact path='/jobs/:id' component={JobApplicants} />
        </Switch>
      </div>
    );
  }
}

export default App;
