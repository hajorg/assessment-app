import React, { Component } from 'react';

class JobApplicants extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jobApplications: [],
      applicants: []
    };

    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    const jobId = this.props.match.params.id;
    try {
      const token = localStorage.getItem('token');
      if (!token || token === 'undefined') return this.props.history.push('/');

      const res = await fetch(`/api/v1/jobs/${jobId}/applicants`, { headers: { 'x-access-token': token } });
      const data = await res.json();
      this.setState({
        jobApplications: data,
      });
      await this.getUsers(data);
    } catch (error) {
      console.log(error);
    }
  }

  async getUsers(data) {
    try {
      const users = [];
      for (const user of data) {
        const res = await fetch(`/api/v1/users/${user.applicant_id}`, { headers: { 'x-access-token': localStorage.getItem('token') } });
        const data = await res.json();
        users.push(data);
      }

      this.setState({
        applicants: users
      });
    } catch (error) {
      console.log(error);
    }
  }

  async handleClick(user) {
    try {
      const res = await fetch(`/api/v1/jobs/${this.props.match.params.id}`, {
        method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token')
          },
          body: JSON.stringify({ applicant_id: user.id })
      });

      const data = await res.json();
      if (data.error || data.errors) {
        console.log(data.error || data.errors);
        return this.handleError();
      }
      return this.props.history.push('/');
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
    if (!this.state.applicants.length) return (
      <div className='container'>
        <h3>Job Applicants</h3>
        <h4>No Data Available</h4>
      </div>
    );

    const accepted = this.state.jobApplications.filter((job) => job.accepted);
    console.log(accepted)

    const jobApplicants = this.state.applicants.map((applicant) => (
      <div key={applicant.id} className='card text-center' style={{ marginTop: '2rem' }}>
          <div className='card-header'>
          {`${applicant.first_name} ${applicant.last_name}` }
          </div>
          <div className='card-body'>
            <p className='card-text'>{applicant.bio && `Bio: ${applicant.bio}`}</p>
            <p className='card-text'>{(accepted.length && accepted[0].applicant_id === applicant.id) ? 'Approved: Yes' : ''}</p>
            <p><b>Required Skills</b>: {applicant.skills.map(skill => skill.name).join(', ')}</p>
            { !(accepted.length && accepted[0].accepted) && <button className='btn btn-secondary' type='button' style={{ width: '7rem' }} onClick={() => this.handleClick(applicant)}>Approve</button>}

          </div>
          <div className='card-footer text-muted'>
            Email: {applicant.email}
          </div>
        </div>
    ));
    return (
      <div className='container'>
        <h3>Job Applicants</h3>
        {
          <div id='alert'>
          { this.state.error &&
          <div className='alert alert-danger' role='alert'>
            An error occurred with your application :(
            </div> }
          </div>
        }
        {this.state.applicants.length && jobApplicants}
        {!this.state.applicants.length && 'No data available'}
      </div>
    );
  }
}

export default JobApplicants;
