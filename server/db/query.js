const knex = require('./knex');
module.exports = {
  //agence

  getAllp() {
    return knex('agenceProfile'); /*.select(*); */
  },
  //update agence
  updateAgence(agenceProfileId, agenceProfile) {
    return knex('agenceProfile')
      .where('agenceProfileId', agenceProfileId)
      .update(agenceProfile, '*');
  },
  //get one agence

  getAgence(id) {
    return knex('agenceProfile').where('agenceProfileId', id);
  },
  //add agence
  createAgence(agence) {
    return knex('agenceProfile').insert(agence, '*');
  },
  //update categories
  updateCategorie(agenceProfileId, categorie) {
    return knex('agenceProfile')
      .where('agenceProfileId', agenceProfileId)
      .update('categorie', categorie);
  },
  //update horaire
  updateHoraire(agenceProfileId, horaire) {
    return knex('agenceProfile')
      .where('agenceProfileId', agenceProfileId)
      .update('horaire', horaire);
  },
  //update nbEmploye
  updateNbrEmployer(agenceProfileId, nb) {
    return knex('agenceProfile')
      .where('agenceProfileId', agenceProfileId)
      .update('nbemploye', nb);
  },
  //presentation
  //update Presentation
  updatePresentation(presentationId, agencePresentation) {
    return knex('agencePresentation')
      .where('presentationId', presentationId)
      .update(agencePresentation, '*');
  },
  //add Presentation
  createPresentation(agencePresentation) {
    return knex('agencePresentation').insert(agencePresentation, '*');
  },
  //delete Presentation
  deletePresentation(presentationId) {
    return knex('agencePresentation')
      .where('presentationId', presentationId)
      .del();
  },
  //get presentation
  getPresentation(id) {
    return knex('agencePresentation').where('agenceProfileId', id);
  },
  //employe
  //update employe
  updateEmploye(employerId, agenceEmploye) {
    return knex('agenceEmployer')
      .where('employerId', employerId)
      .update(agenceEmploye, '*');
  },
  //insert employe
  createEmploye(agenceEmploye) {
    return knex('agenceEmployer').insert(agenceEmploye, '*');
  },

  //delete employe
  deleteEmploye(employerId) {
    return knex('agenceEmployer')
      .where('employerId', employerId)
      .del();
  },
  //get Employe
  getEmploye(id) {
    return knex('agenceEmployer').where('agenceProfileId', id);
  },
  //vheicule
  //update vheicule

  updateVheicule(vehiculeId, agenceVheicule) {
    return knex('agenceVehicule')
      .where('vehiculeId', vehiculeId)
      .update(agenceVheicule, '*');
  },
  //nb vheicule
  nembreVheicule(agenceProfileId) {
    return knex('agenceVehicule')
      .where('agenceProfileId', agenceProfileId)
      .count('vehiculeId');
  },

  //add vheicule
  createVheicule(agenceVheicule) {
    return knex('agenceVehicule').insert(agenceVheicule, '*');
  },
  //delete vheicule
  deleteVheicule(vehiculeId) {
    return knex('agenceVehicule')
      .where('vehiculeId', vehiculeId)
      .del();
  },
  //get vehicule
  getVheicule(id) {
    return knex('agenceVehicule').where('agenceProfileId', id);
  }
};
