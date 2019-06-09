import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import checkAuthencation from '../utils/checkUnauthentication';

class JobPostings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jobs: [],
      success: false,
      error: ''
    };

    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    try {
      const token = localStorage.getItem('token');
      if (!token || token === 'undefined') return this.props.history.push('/');
      const res = await fetch('/api/v1/jobs', { headers: { 'x-access-token': token } });
      const data = await res.json();
      if (data.error) {
        this.setState({ error: data.error });
        return;
      }

      this.setState({ jobs: data });
    } catch (error) {
      console.log(error);
    }
  }

  async handleClick(job) {
    try {
      const res = await fetch('/api/v1/applicants', {
        method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token')
          },
          body: JSON.stringify({ job_id: job.job_id })
      });

      checkAuthencation(res, this.props.history);

      const data = await res.json();
      if (data.error || data.errors) {
        return this.handleError(data.error);
      }
      window.scrollTo(0, document.getElementById('alert').offsetTop - 20);
      this.setState({ success: true, error: '' });
    } catch (error) {
      console.log(error);
    }
  }

  handleError(error) {
    window.scrollTo(0, document.getElementById('alert').offsetTop - 20);
    this.setState({ error, success: false });
    return;
  }

  render() {
    const jobs = this.state.jobs.map((job) => (
      <div key={job.job_id} className='card text-center' style={{ marginTop: '2rem' }}>
          <div className='card-header'>
            <Link style={{ textDecoration: 'underline' }} to={`/jobs/${job.job_id}`}>{job.title}</Link>
          </div>
          <div className='card-body'>
            <p className='card-text'>{job.description}</p>
            <p><b>Required Skills</b>: {job.skills.join(', ')}</p>
            <button className='btn btn-secondary' type='button' style={{ width: '7rem' }} onClick={() => this.handleClick(job)}>Apply</button>

          </div>
          <div className='card-footer text-muted'>
            {new Date(job.updated_at).toLocaleDateString()}
          </div>
        </div>
    ));
    return (
      <div className='container'>
        <h3>Jobs</h3>
        {!this.state.jobs.length && 'No Job available!'}
        {
          <div id='alert'>
            {
              this.state.error &&
              <div className='alert alert-danger' role='alert'>
                { this.state.error } :(
              </div>
            }
            {
              this.state.success &&
              <div className='alert alert-success' role='alert'>
                Your application was successful!
              </div>
            }
          </div>
        }
        {jobs}
      </div>
    );
  }
}

export default JobPostings;
