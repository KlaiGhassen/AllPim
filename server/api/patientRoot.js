const express = require('express');
const router = express.Router();
const queries = require('../db/patientquery');


router.get('/', (req, res) => {
    queries.getAll().then(patients => {
      res.json(patients);
    });
  });
  module.exports = router;
