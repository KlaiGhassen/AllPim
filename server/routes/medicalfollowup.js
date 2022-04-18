const express = require('express');
const medicalfollowup = require('../Controllers/medicalfollowup');
const router = express.Router();



router.get('/', medicalfollowup.getAllMedicalFollowup);

router.post('/', medicalfollowup.AddMedicalFollowup);
router.delete('/:id', medicalfollowup.deleteMedicalfollowup);
router.patch('/:id', medicalfollowup.updateMedicalfollowup);

router.get('/:patientId', medicalfollowup.getMedicalFollowupbyid);
router.get('/detail/:_id', medicalfollowup.getMedicalFollowupbyDate);

module.exports = router;