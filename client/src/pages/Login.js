import React, { Component } from 'react';

import './Form.css';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: '',
      errors: [],
      requestInProgress: false
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
    if (this.state.error || this.state.errors.length) this.setState({ error: '', errors: [] });
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
      this.props.handleToken();
      return this.props.history.push('/');
    }

    this.setState({
      error: data.error || '',
      errors: data.errors || [],
      requestInProgress: false
    });
  }

  async login() {
    const { email, password } = this.state;
    this.setState({ requestInProgress: true });

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
    const errors = this.state.errors.map((error, i) =>
      <li className='list-group-item d-flex justify-content-between align-items-center' key={i}>{error.msg}</li>
    );
    const button = !this.state.requestInProgress
      ? <button className='btn btn-primary btn-lg' type='submit' onClick={this.handleSubmit}>Login</button>
      : 'Please wait...';

    return (
      <div className='container' style={{
        padding: '1.5rem',
        margin: '0 auto',
        borderWidth: '2rem',
        width: '40rem'
      }}>
        <h3>Login</h3>
        {
          (this.state.error || this.state.errors.length > 0) &&
          <div>
            {
              this.state.error &&
              <div className='alert alert-danger' role='alert'>
                {this.state.error}
              </div>
            }
            <ul className='list-group' style={{ color: 'red' }}>
              {errors}
            </ul>
          </div>
        }
        <br />
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
            {button}
          </div>
        </form>
      </div>
    )
  }
}

export default Login;
