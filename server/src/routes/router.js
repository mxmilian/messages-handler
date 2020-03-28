const express = require('express');

const router = express.Router();

router.route('/').get((req, res) => {
  try {
    res.status(200).json({
      status: 'access',
      data: {
        message: 'nice! job!'
      }
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e.message
    });
  }
});

module.exports = router;