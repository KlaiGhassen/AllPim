var knex = require('knex')({
  client: 'postgresql',
  connection: 'postgres://postgres:ghassen@127.0.0.1:5432/test'
});
function addtables() {
  return knex.schema
    .createTable('agenceProfile', table => {
      table.increments('agenceProfileId').primary();
      table.integer('dateCreation');
      table.text('nomAgence');
      table.text('adresse');
      table.text('telephone');
      table.jsonb('categorie').defaultTo({
        typeA: true,
        typeB: true,
        typeC: true,
        typeD: false,
        typeA1: false,
        typeBE: false,
        typeCE: false,
        typeDE: false
      });
      table.jsonb('horaire').defaultTo({
        lundi: {
          day_fr: 'lundi',
          day_ar: 'الاثنين',
          chkOne: 'true',
          chkTow: 'true',
          dateDebOne: '07:00',
          dateDebTow: '',
          dateEndOne: '20:00',
          dateEndTow: ''
        },
        mardi: {
          day_fr: 'mardi',
          day_ar: 'الثلاثاء',

          chkOne: 'true',
          chkTow: 'true',
          dateDebOne: '07:00',
          dateDebTow: '',
          dateEndOne: '20:00',
          dateEndTow: ''
        },

        mercredi: {
          day_fr: 'mercredi',
          day_ar: 'الأربعاء',

          chkOne: 'true',
          chkTow: 'true',
          dateDebOne: '07:00',
          dateDebTow: '',
          dateEndOne: '20:00',
          dateEndTow: ''
        },
        jeudi: {
          day_fr: 'jeudi',
          day_ar: 'الخميس',

          chkOne: 'true',
          chkTow: 'true',
          dateDebOne: '07:00',
          dateDebTow: '',
          dateEndOne: '20:00',
          dateEndTow: ''
        },
        vendredi: {
          day_fr: 'vendredi',
          day_ar: 'الجمعة',

          chkOne: 'true',
          chkTow: 'false',
          dateDebOne: '07:00',
          dateDebTow: '15:00',
          dateEndOne: '12:00',
          dateEndTow: '20:00'
        },
        samedi: {
          day_fr: 'samedi',
          day_ar: 'السبت',

          chkOne: 'true',
          chkTow: 'true',
          dateDebOne: '07:00',
          dateDebTow: '',
          dateEndOne: '16:00',
          dateEndTow: ''
        },
        dimanche: {
          day_fr: 'dimanche',
          day_ar: 'الأحد',
          chkOne: 'false',
          chkTow: 'true',
          dateDebOne: '',
          dateDebTow: '',
          dateEndOne: '',
          dateEndTow: ''
        }
      });
      table.integer('nbemploye');
      table.text('ownerName');
    })
    .then(() => {
      return knex.schema.createTable('agenceVehicule', table => {
        table.increments('vehiculeId').primary();
        table.text('nomVehicule');
        table.text('descVehicule');
        table.text('imgVehicule');
        table.integer('agenceProfileId');
        table.foreign('agenceProfileId').references('agenceProfile');
      });
    })
    .then(() => {
      return knex.schema.createTable('agenceEmployer', table => {
        table.increments('employerId').primary();
        table.text('nomEmployer');
        table.text('descEmployer');
        table.text('imgEmployer');
        table.text('jobEmployer');
        table.integer('agenceProfileId');
        table.foreign('agenceProfileId').references('agenceProfile');
      });
    })
    .then(() => {
      return knex.schema.createTable('agencePresentation', table => {
        table.increments('presentationId').primary();
        table.text('nomPresentation');
        table.text('descPresentation');
        table.integer('agenceProfileId');

        table.foreign('agenceProfileId').references('agenceProfile');
      });
    });
}
addtables().then(() => {
  console.log('tables created');
});
