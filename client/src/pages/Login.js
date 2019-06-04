import React, { Component } from 'react';

import './Form.css';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (localStorage.getItem('token') && localStorage.getItem('token') !== 'undefined') {
      return this.props.history.push('/');
    }
  }

  handleChange(e) {
    if (this.state.error) this.setState({ error: false });
    const { name, value } = e.target;
    this.setState(() => ({
      [name]: value
    }));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const data = await this.login();
    if (!data.error && data.token) {
      localStorage.setItem('token', data.token);
      return this.props.history.push('/');
    }
    this.setState({ error: true });
  }

  async login() {
    const { email, password } = this.state;
    try {
      const res = await fetch('/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      return res.json();
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <div className='container' style={{
        padding: '1.5rem',
        margin: '0 auto',
        borderWidth: '2rem',
        width: '40rem'
      }}>
        <h3>Login</h3>
        {this.state.error && <div className='alert alert-danger' role='alert'>
          An error occurred with your application :(
        </div>}
        <form className='container'>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input type='email' name='email' id='email' className='form-control form-control-sm' value={this.state.email} onChange={this.handleChange} />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input type='password' name='password' id='password' className='form-control form-control-sm' value={this.state.password} onChange={this.handleChange} />
          </div>
          <div className='form-group'>
            <button className='btn btn-primary btn-lg' type='submit' onClick={this.handleSubmit}>Login</button>
          </div>
        </form>
      </div>
    )
  }
}

export default Login;
