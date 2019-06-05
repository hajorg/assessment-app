import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';

import './App.css';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Post from './pages/Post';
import JobPosting from './pages/JobPosting';
import JobApplicants from './pages/JobApplicants';

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
        {
          loggedIn &&
          <nav className='container nav justify-content-center' style={{ marginBottom: '2rem' }}>
            <Link className='nav-link active' to='/jobs'>Jobs</Link>
            <Link className='nav-link' to='/job/posts'>Create Job</Link>
            <Link className='nav-link' to='/logout'>Logout</Link>
          </nav>
        }
        {
          !loggedIn &&
          <nav className='container nav justify-content-end' style={{ marginBottom: '2rem' }}>
            <Link className='nav-link active' to='/login'>Login</Link>
            <Link className='nav-link' to='/signup'>Sign up</Link>
          </nav>
        }
        <Switch>
          <Route exact path='/' render={() => (
            <header className='App-header'>
              <div className='message'>{ this.state.apiMessage }</div>
            </header>
          )} />
          <Route path='/signup' render={(props) => <SignUp {...props} handleToken={this.handleToken} />} />
          <Route path='/login' render={(props) => <Login {...props} handleToken={this.handleToken} />} />
          <Route path='/logout' render={(props) => <Logout {...props} handleLogout={this.handleLogout} />} />
          <Route exact path='/jobs' component={JobPosting} />
          <Route exact path='/jobs/:id' component={JobApplicants} />
          <Route exact path='/job/posts' component={Post} />
        </Switch>
      </div>
    );
  }
}

export default App;
