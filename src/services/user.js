const { queryUsers, updateAvatarById, queryUserByName } = require('../repository/user');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs')

function getUsers() {
    return queryUsers();
}

function uploadAvatar(req) {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(process.cwd(), "static");

    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
              reject(err);
            }
            const newPath = `${path.join(process.cwd(),"static")}/${files.file.originalFilename}`;
            fs.rename(files.file.filepath, newPath, async (err) => {
              if (err) {
                reject(err);
              }

              await updateAvatarById(req.user.id, files.file.originalFilename);
              resolve();
            })
          })
    });
}

async function getAvatar(name) {
    const user = await queryUserByName(name);
    if (!user.avatar) {
        throw new Error('not find image');
    }

    const data = fs.readFileSync(`${path.join(process.cwd(),"static")}/${user.avatar}`);
    return { data, filename: user.avatar };
}

module.exports = { getUsers, uploadAvatar, getAvatar }