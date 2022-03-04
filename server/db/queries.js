const userdb = require("../models/admin");

module.exports = {
  authentification(user, password) {
    return  userdb.find({ user: user, password: password })
  },
  getUserById(id) {
    return knex("users").where({ id: id }).first();
  },
  getListAdmin() {
    return knex("users").where({ role: 1 });
  },
  updateAccount(current_user, current_password, fname, lname, user) {
    return knex("users")
      .update({ fname: fname, lname: lname, user: user })
      .where({ user: current_user, password: current_password })
      .returning("*");
  },
  updatePassword(id, newpass) {
    return knex("users")
      .update({ password: newpass })
      .where({ id: id })
      .returning("*");
  },
  addAdmin(admin) {
    return knex("users").insert(admin).returning("*");
  },
  editAdmin(id, admin) {
    return knex("users").update(admin).where({ id: id }).returning("*");
  },
  deleteAdmin(id) {
    return knex("users")
      .del()
      .where({ id: id })
      .whereNot({ role: 0 })
      .returning("*");
  },
  getCategories() {
    return knex("categories").orderBy("id", "asc");
  },
  addArticle(article) {
    return knex("articles").insert(article).returning("*");
  },
  getArticles() {
    return knex({ a: "articles" })
      .select([
        "a.id",
        "a.name",
        { category: "c.name" },
        "a.price",
        "a.imageUrl",
      ])
      .innerJoin({ c: "categories" }, "a.category_id", "c.id")
      .orderBy("a.id", "asc");
  },
  deleteArticle(id) {
    return knex("articles").del().where({ id: id }).returning("*");
  },
  addOrder(order, articles) {
    return knex.transaction((trx) => {
      return trx("orders")
        .insert(order)
        .returning("*")
        .then((order) => {
          if (articles && articles.length > 0) {
            let order_articles = [];
            articles.forEach((element) => {
              order_articles.push({
                order_id: order[0].id,
                article_id: element.article,
                quantity: element.quantity,
              });
            });
            return trx("order_articles")
              .insert(order_articles)
              .then(() => {
                return order;
              });
          } else {
            trx.rollback;
            throw new Error("orders doesn't have articles");
          }
        })
        .then((data) => {
          trx.commit;
          return data;
        })
        .catch((err) => {
          trx.rollback;
          throw err;
        });
    });
  },
  editOrder(id, order) {
    return knex("orders").update(order).where({ id: id }).returning("*");
  },
  getOrderById(id) {
    return knex("orders").where({ id: id }).first();
  },
  getOrders(type) {
    q = knex({ o: "orders" })
      .select(["o.*", "a.name", "a.name", "a.price", "oa.quantity"])
      .leftJoin({ oa: "order_articles" }, "o.id", "oa.order_id")
      .leftJoin({ a: "articles" }, "oa.article_id", "a.id");
    if (type === "archived") {
      q.where({ is_archived: true });
    } else {
      q.where({ is_archived: false });
    }
    q.orderBy("updated_at", "desc");
    return q;
  },
};
