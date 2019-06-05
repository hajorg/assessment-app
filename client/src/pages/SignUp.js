import React, { Component } from 'react';

import skills from '../utils/skills';
import './Form.css';

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: '',
      last_name: '',
      role: 'candidate',
      email: '',
      password: '',
      bio: '',
      location: '',
      role_options: [ 'candidate', 'client' ],
      error: false,
      skills: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined') {
      return this.props.history.push('/');
    }
  }

  handleChange(e) {
    if (this.state.error) this.setState({ error: false });
    const jobSkills = [];
    if (e.target.type === 'select-multiple') {
      const options = e.target.options;
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          jobSkills.push(options[i].value);
        }
      }
    }
    
    const { name, value } = e.target;
    this.setState(() => ({
      [name]: jobSkills.length ? jobSkills : value
    }));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const data = await this.createUser();
    if (!data.error && data.token) {
      localStorage.setItem('token', data.token);
      this.props.handleToken();
      return this.props.history.push('/');
    }
    this.setState({ error: true });
  }

  async createUser() {
    const { first_name, last_name, email, password, bio, location, role, skills } = this.state;
    try {
      const res = await fetch('/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ first_name, last_name, email, password, bio, location, role, skills })
      });
      return res.json();
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const roles = this.state.role_options.map((role, i) => <option key={i} value={role}>{role}</option>);
    const skillOptions = skills.map((item) => (
      <option key={item.id} value={item.name}>
        {item.name}
      </option>
    ));

    return (
      <div className='container' style={{
        padding: '1.5rem',
        margin: '0 auto',
        borderWidth: '2rem',
        width: '40rem'
      }}>
        <h3>Sign Up</h3>
        {this.state.error && <div className='alert alert-danger' role='alert'>
          An error occurred with your application :(
        </div>}
        <form className='container'>
          <div className='form-group'>
            <label htmlFor='first_name'>First Name</label>
            <input type='text' name='first_name' id='first_name' className='form-control form-control-sm' value={this.state.first_name} onChange={this.handleChange} />
          </div>
          <div className='form-group'>
            <label htmlFor='last_name'>Last Name</label>
            <input type='text' name='last_name' id='last_name' className='form-control form-control-sm' value={this.state.last_name} onChange={this.handleChange} />
          </div>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input type='email' name='email' id='email' className='form-control form-control-sm' value={this.state.email} onChange={this.handleChange} />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input type='password' name='password' id='password' className='form-control form-control-sm' value={this.state.password} onChange={this.handleChange} />
          </div>
          <div className='form-group'>
            <label htmlFor='location'>location</label>
            <input type='location' name='location' id='location' className='form-control form-control-sm' value={this.state.location} onChange={this.handleChange} />
          </div>
          <div className='form-group'>
            <label htmlFor='role'>Role</label>
            <select className='form-control form-control-sm' id='role' name='role' onChange={this.handleChange}>
              {roles}
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor='des'>Skills</label>
            <input readOnly type='text' name='skills' id='skills' className='form-control form-control-sm' value={this.state.skills} onChange={this.handleChange} />
          </div>
          <div className='form-group'>
            <select multiple className='form-control form-control-sm' onChange={this.handleChange} name='skills'>
              {skillOptions}
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor='bio'>Bio</label>
            <textarea className='form-control form-control-sm' id='bio' name='bio' value={this.state.bio} onChange={this.handleChange} rows='3' />
          </div>
          <div className='form-group'>
            <button className='btn btn-primary btn-lg' type='submit' onClick={this.handleSubmit}>Sign Up</button>
          </div>
        </form>
      </div>
    )
  }
}

export default SignUp;