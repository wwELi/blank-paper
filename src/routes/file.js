var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.download("views/140147-d117dfa7-5aa3-834a-4f72-07b895865b85.jpg", (err) => {
    console.log(err)
  })
});

module.exports = router;
