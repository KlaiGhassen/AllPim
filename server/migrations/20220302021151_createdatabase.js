exports.up = function (knex) {
  return knex.schema
    .createTable("ophto", (table) => {
      table.increments("id").primary();
      table.timestamp("createdAt").defaultTo(knex.fn.now());
      table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
      table.text("name");
      table.text("last_name");
      table.text("email");
      table.text("profile_picture");
      table.text("password");
      table.boolean("verifed").default(false);
      table.text("diplome");
    })
    .then(() => {
      return knex.schema
        .createTable("patient", (table) => {
          table.increments("id").primary();
          table.text("name");
          table.text("last_name");
          table.text("email");
          table.text("profile_picture");
          table.text("password");
          table.boolean("verifed").defaultTo(false);
          table.timestamp("createdAt").defaultTo(knex.fn.now());
          table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
          table
            .integer("ophto_id")
            .references("id")
            .inTable("ophto")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
        })
        .then(() => {
          return knex.schema.createTable("reservation", (table) => {
            table.increments("id").primary();
            table.text("title");
            table.text("type");
            table.text("description");
            table.timestamp("createdAt").defaultTo(knex.fn.now());
            table
              .timestamp("updated_at")
              .notNullable()
              .defaultTo(knex.fn.now());
            table
              .integer("ophto_id")
              .references("id")
              .inTable("ophto")
              .onDelete("CASCADE")
              .onUpdate("CASCADE");
            table
              .integer("patient_id")
              .references("id")
              .inTable("patient")
              .onDelete("CASCADE")
              .onUpdate("CASCADE");
          });
        })
        .then(() => {
          return knex.schema.createTable("event", (table) => {
            table.increments("id").primary();
            table.text("title");
            table.text("type");
            table.text("description");
            table.timestamp("createdAt").defaultTo(knex.fn.now());
            table
              .timestamp("updated_at")
              .notNullable()
              .defaultTo(knex.fn.now());
            table
              .integer("ophto_id")
              .references("id")
              .inTable("ophto")
              .onDelete("CASCADE")
              .onUpdate("CASCADE");
          });
        });
    });
};

exports.down = function (knex) {
    return knex.schema
    .dropTable("event")
    .then(() => {
      return knex.schema.dropTable("reservation");
    })
    .then(() => {
      return knex.schema.dropTable("patient");
    })
    .then(() => {
      return knex.schema.dropTable("ophto");
    });

};
