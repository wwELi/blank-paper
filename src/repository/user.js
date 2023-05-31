const mysql = require('mysql');
const { v4:uuidv4 } = require('uuid') ;

function createQuery() {
    const connection = mysql.createConnection({
        host: 'db',
        port: 3306,
        user: 'root',
        password: 'admin123',
        database: 'sys'
    });

    return {
        queryUsers() {
            return new Promise((resolve, reject) => {
                connection.query("SELECT * FROM users", (err, result, fields) => {
                    err ? reject(err) : resolve(result);
                })
            })
        },
        queryUserByName(username) {
            return new Promise((resolve, reject) => {
                connection.query("SELECT * FROM users WHERE name=? ", [username], (err, result, fields) => {
                    err ? reject(err) : resolve(result[0]);
                })
            })
        },
        createUser({ username,password,email }) {
            const id = uuidv4();
            return new Promise((resolve, reject) => {
                connection.query("INSERT INTO users (id,name,password,email) VALUES(?,?,?,?)", [id,username,password,email], (err, result) => {
                    err ? reject(err) : resolve(result);
                })
            })
        }
    }
}


module.exports = createQuery()