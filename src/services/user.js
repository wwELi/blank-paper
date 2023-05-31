const { queryUsers } = require('../repository/user');

function getUsers() {
    return queryUsers();
}

module.exports = { getUsers }