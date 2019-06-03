import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

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
    const res = await fetch('/api/v1');
    return res.json();
  }
  render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <div className='message'>{ this.state.apiMessage }</div>
        </header>
      </div>
    );
  }
}

export default App;
