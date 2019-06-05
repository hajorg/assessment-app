import { Component } from 'react';

class Logout extends Component {
  componentDidMount() {
    localStorage.removeItem('token');
    this.props.handleLogout();
    return this.props.history.push('/');
  }

  render() {
    return '';
  }
};

export default Logout;
