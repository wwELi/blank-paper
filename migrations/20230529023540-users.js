'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, cb) {
  return db.createTable('users', {
    id: { type: 'int', primaryKey: true },
    name: 'string',
    password: 'string',
  }, cb);
};

exports.down = function(db, cb) {
  return db.dropTable('users', cb);
};

exports._meta = {
  "version": 1
};
