const express = require('express');
const router = express.Router();
const queries = require('../db/query');
//agence
//get all agences
router.get('/', (req, res) => {
  queries.getAllp().then(agenceProfile => {
    res.json(agenceProfile);
  });
});
//get one agence
router.get('/agence/:agenceProfileId', (req, res) => {
  queries.getAgence(req.params.agenceProfileId).then(agence => {
    res.json(agence);
  });
});
//add agence
router.post('/agence', (req, res) => {
  queries.createAgence(req.body).then(() => {
    res.json({
      inserted: true
    });
  });
});
//updateagence
router.put('/agence/:agenceProfileId', (req, res) => {
  queries.updateAgence(req.params.agenceProfileId, req.body).then(() => {
    res.json({
      updated: true
    });
  });
});
//update categories
router.put('/categories/:agenceProfileId', (req, res) => {
  queries.updateCategorie(req.params.agenceProfileId, req.body).then(() => {
    res.json({
      updated: true
    });
  });
});
//updateHoraire
router.put('/horaire/:agenceProfileId', (req, res) => {
  queries.updateHoraire(req.params.agenceProfileId, req.body).then(() => {
    res.json({
      updated: true
    });
  });
});
//update nb employer
router.put('/nb/:agenceProfileId', (req, res) => {
  console.log('test', req.params.agenceProfileId, req.body);
  queries
    .updateNbrEmployer(req.params.agenceProfileId, req.body.nb)
    .then(() => {
      res.json({
        updated: true
      });
    });
});
//presentation
//updatePresentation
router.put('/presentation/:presentationId', (req, res) => {
  queries.updatePresentation(req.params.presentationId, req.body).then(() => {
    res.json({
      updated: true
    });
  });
});
//add presentation
router.post('/presentation', (req, res) => {
  queries.createPresentation(req.body).then(() => {
    res.json({
      inserted: true
    });
  });
});
// delete presentation
router.delete('/presentation/:presentationId', (req, res) => {
  queries.deletePresentation(req.params.presentationId).then(() => {
    res.json({
      deleted: true
    });
  });
});
//get presentations

router.get('/presentation/:agenceProfileId', (req, res) => {
  queries.getPresentation(req.params.agenceProfileId).then(presentation => {
    res.json(presentation);
  });
});
//employe
//update employe
router.put('/employe/:employerId', (req, res) => {
  queries.updateEmploye(req.params.employerId, req.body).then(() => {
    res.json({
      updated: true
    });
  });
});
//add employer
router.post('/employe', (req, res) => {
  queries.createEmploye(req.body).then(() => {
    res.json({
      inserted: true
    });
  });
});
//delete employe
router.delete('/employe/:employerId', (req, res) => {
  queries.deleteEmploye(req.params.employerId).then(() => {
    res.json({
      deleted: true
    });
  });
});
//get employes

router.get('/employe/:agenceProfileId', (req, res) => {
  queries.getEmploye(req.params.agenceProfileId).then(Employe => {
    res.json(Employe);
  });
});
// count vheicule
router.get('/vheiculenb/:agenceProfileId', (req, res) => {
  queries.nembreVheicule(req.params.agenceProfileId, req.body).then(nb => {
    res.json(nb);
  });
});
//update vheicule
router.put('/vheicule/:vehiculeId', (req, res) => {
  queries.updateVheicule(req.params.vehiculeId, req.body).then(() => {
    res.json({
      updated: true
    });
  });
});
//add vheicule
router.post('/vheicule', (req, res) => {
  queries.createVheicule(req.body).then(() => {
    res.json({
      inserted: true
    });
  });
});
//delete vheicule

router.delete('/vheicule/:vehiculeId', (req, res) => {
  queries.deleteVheicule(req.params.vehiculeId).then(() => {
    res.json({
      deleted: true
    });
  });
});
//get vheicule

router.get('/vheicule/:agenceProfileId', (req, res) => {
  queries.getVheicule(req.params.agenceProfileId).then(vheicule => {
    res.json(vheicule);
  });
});

module.exports = router;
