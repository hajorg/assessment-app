import React, { Component } from 'react';

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
      error: '',
      errors: [],
      skills: [],
      allSkills: [],
      requestInProgress: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined') {
      return this.props.history.push('/');
    }

    const res = await fetch('/api/v1/skills');
    const data = await res.json();
    this.setState({ allSkills: data });
  }

  handleChange(e) {
    if (this.state.error || this.state.errors.length) this.setState({ error: '', errors: [] });
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
    this.setState({ requestInProgress: false });
    if (!data.error && data.token) {
      localStorage.setItem('token', data.token);
      this.props.handleToken();
      return this.props.history.push('/');
    }
    this.setState({ error: data.error || '',  errors: data.errors || [] });
    window.scrollTo(0, document.getElementById('signup').offsetTop - 20);
  }

  async createUser() {
    const { first_name, last_name, email, password, bio, location, role } = this.state;
    const mappedSkills = this.state.allSkills.filter((skill) => this.state.skills.includes(skill.name));
    const skills = mappedSkills.map(skill => ({ id: skill.id }));
    this.setState({ requestInProgress: true });
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
    const skillOptions = this.state.allSkills.map((item) => (
      <option key={item.id} value={item.name}>
        {item.name}
      </option>
    ));
    const errors = this.state.errors.map((error, i) =>
      <li className='list-group-item d-flex justify-content-between align-items-center' key={i}>{error.msg}</li>
    );
    const button = !this.state.requestInProgress
      ? <button className='btn btn-primary btn-lg' type='submit' onClick={this.handleSubmit}>Sign Up</button>
      : 'Please wait...';

    return (
      <div className='container' style={{
        padding: '1.5rem',
        margin: '0 auto',
        borderWidth: '2rem',
        width: '40rem'
      }}>
        <h3 id='signup'>Sign Up</h3>
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
            {button}
          </div>
        </form>
      </div>
    )
  }
}

export default SignUp;
