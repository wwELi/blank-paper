const { queryUserByName, createUser } = require('../repository/user');
const jwt = require('jsonwebtoken');

async function signUp({ username, password, email }) {
  const user = await queryUserByName(username);
  if (user) {
    throw { msg: 'user has created' };
  }

  return createUser({ username, password, email });
}

async function login({ username, password }) {
  const user = await queryUserByName(username);

  if (user && user.name === username && password === user.password) {
    const token = jwt.sign({ username }, 'SECRET', { expiresIn: '1h' })
    return { uer: user, token: 'Bearer ' + token };
  } else {
     throw new Error({ msg: 'login error' });
  }
}

module.exports = {
  login,
  signUp
};