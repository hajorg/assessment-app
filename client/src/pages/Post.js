import React, { Component } from 'react';

import skills from '../utils/skills';

class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      description: '',
      skills: [],
      error: '',
      errors: [],
      requestInProgress: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (!localStorage.getItem('token') || localStorage.getItem('token') === 'undefined') {
      return this.props.history.push('/login');
    }
  }

  handleChange(e) {
    const jobSkills = [];
    if (e.target.type === 'select-multiple') {
      const options = e.target.options;
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          jobSkills.push(options[i].value);
        }
      }
    }
    
    if (this.state.error || this.state.errors.length) this.setState({ error: '', errors: [] });
    const { name, value } = e.target;
    this.setState(() => ({
      [name]: jobSkills.length ? jobSkills : value
    }));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const data = await this.createJob();
    if (data.error || (data.errors && data.errors.length)) {
      this.setState({
        error: data.error || '',
        errors: data.errors || [],
        requestInProgress: false
      });
      return;
    }

    return this.props.history.push('/jobs');
  }

  async createJob() {
    const { title, description, skills } = this.state;
    try {
      this.setState({ requestInProgress: true });

      const res = await fetch('/api/v1/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ title, description, skills })
      });
      return res.json();
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const skillOptions = skills.map((item) => (
      <option key={item.id} value={item.name}>
        {item.name}
      </option>
    ));
    const errors = this.state.errors.map((error, i) =>
      <li className='list-group-item d-flex justify-content-between align-items-center' key={i}>{error.msg}</li>
    ); 
    const button = !this.state.requestInProgress
      ? <button className='btn btn-primary btn-lg' type='submit' onClick={this.handleSubmit}>Post</button>
      : 'Please wait...';

    return (
      <div className='container' style={{
        padding: '1.5rem',
        margin: '0 auto',
        borderWidth: '2rem',
        width: '40rem'
      }}>
        <h3>Post Job</h3>
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
            <label htmlFor='title'>Job Title</label>
            <input type='text' name='title' id='title' className='form-control form-control-sm' value={this.state.title} onChange={this.handleChange} />
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
            <label htmlFor='description'>Description</label>
            <textarea className='form-control form-control-sm' id='description' name='description' value={this.state.description} onChange={this.handleChange} rows='3' />
          </div>
          <div className='form-group'>
            {button}
          </div>
        </form>
      </div>
    )
  }
}

export default Post;
