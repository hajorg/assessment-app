module.exports = (res, history) => {
  if (res.status === 401) {
    localStorage.removeItem('token');
    history.push('/login');
    return false;
  }

  return true;
};
