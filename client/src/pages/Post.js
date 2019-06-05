import React, { Component } from 'react';

import skills from '../utils/skills';

class JobPosting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      description: '',
      skills: []
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
    
    if (this.state.error) this.setState({ error: false });
    const { name, value } = e.target;
    this.setState(() => ({
      [name]: jobSkills.length ? jobSkills : value
    }));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const data = await this.createJob();
    if (!data.error) {
      return this.props.history.push('/jobs');
    }
    this.setState({ error: true });
  }

  async createJob() {
    const { title, description, skills } = this.state;
    try {
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
    return (
      <div className='container' style={{
        padding: '1.5rem',
        margin: '0 auto',
        borderWidth: '2rem',
        width: '40rem'
      }}>
        <h3>Post Job</h3>
        {this.state.error && <div className='alert alert-danger' role='alert'>
          An error occurred with your application :(
        </div>}
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
            <button className='btn btn-primary btn-lg' type='submit' onClick={this.handleSubmit}>Post</button>
          </div>
        </form>
      </div>
    )
  }
}

export default JobPosting;
