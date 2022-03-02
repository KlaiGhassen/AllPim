const knex = require('./knex');
module.exports = {
    getAll() {
        return knex('patient'); /*.select(*); */
      },
      addPatient(patient) {
        return knex('patient').insert(patient, '*');
      },
      getOnePatient(id) {
        return knex('patient').where('id', id);
      },
      


}