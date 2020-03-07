const knex = require("knex");
require("dotenv").config();

const knexInstance = knex({
  client: "pg",
  connection: process.env.DB_URL
});

function getSearchItem(searchTerm) {
  knexInstance
    .select("product_id", "name", "price", "category", "checked")
    .from("shopping_list")
    .where("name", "ILIKE", `%${searchTerm}%`)
    .then(result => console.log(result));
}

// getSearchItem("burger");

function getPaginationItems(page) {
  const produtsPerPage = 6;
  const offset = produtsPerPage * (page - 1);
  knexInstance
    .select("product_id", "name", "price", "category", "date_added", "checked")
    .from("shopping_list")
    .limit(produtsPerPage)
    .offset(offset)
    .then(result => console.log(result));
}

// getPaginationItems(3);

function getItemsAfterDate(daysAgo) {
  knexInstance
    .select("product_id", "name", "price", "category", "date_added", "checked")
    .where(
      "date_added",
      ">",
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .from("shopping_list")
    .then(result => console.log(result));
}

// getItemsAfterDate(10);

function getTotalCost() {
  knexInstance
    .select("category")
    .sum("price as total")
    .from("shopping_list")
    .groupBy("category")
    .then(result => console.log(result));
}
getTotalCost();
