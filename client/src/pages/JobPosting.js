import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Posts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jobs: []
    };

    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    this.ref = window.document.getElementById('alert');
    try {
      const token = localStorage.getItem('token');
      if (!token || token === 'undefined') return this.props.history.push('/');
      const res = await fetch('/api/v1/jobs', { headers: { 'x-access-token': token } });
      const data = await res.json();
      this.setState({
        jobs: data
      });
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

      const data = await res.json();
      if (data.error || data.errors) {
        return this.handleError();
      }
      return this.props.history.push('/jobs');
    } catch (error) {
      console.log(error);
    }
  }

  handleError() {
    window.scrollTo(0, document.getElementById('alert').offsetTop - 20);
    this.setState({ error: true });
    return;
  }

  render() {
    const jobs = this.state.jobs.map((job) => (
      <div key={job.job_id} className='card text-center' style={{ marginTop: '2rem' }}>
          <div className='card-header'>
            <Link to={`/jobs/${job.job_id}`}>{job.title}</Link>
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
                An error occurred with your application :(
              </div>
            }
          </div>
        }
        {jobs}
      </div>
    );
  }
}

export default Posts;
