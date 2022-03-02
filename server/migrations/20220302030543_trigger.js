const ON_UPDATE_TIMESTAMP_FUNCTION = `
  CREATE OR REPLACE FUNCTION on_update_timestamp()
  RETURNS trigger AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
$$ language 'plpgsql';
`;

const ON_UPDATE_TRIGGER = `
    CREATE TRIGGER check_update
        BEFORE UPDATE ON patient
        FOR EACH ROW
        EXECUTE FUNCTION on_update_timestamp();
`;

const DROP_ON_UPDATE_TIMESTAMP_FUNCTION = `DROP FUNCTION on_update_timestamp`;
const DROP_ON_UPDATE_TRIGGER = `DROP TRIGGER check_update on patient`;

exports.up = function (knex) {
  return knex.raw(ON_UPDATE_TIMESTAMP_FUNCTION).then(() => {
    return knex.raw(ON_UPDATE_TRIGGER);
  });
};

exports.down = function (knex) {
  return knex.raw(DROP_ON_UPDATE_TRIGGER).then(() => {
    return knex.raw(DROP_ON_UPDATE_TIMESTAMP_FUNCTION);
  });
};