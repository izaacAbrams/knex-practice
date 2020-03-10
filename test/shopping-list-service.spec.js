const ShoppingListService = require("../src/shopping-list-service");
const knex = require("knex");

describe("Shopping list service object", function() {
  let db;
  let testItems = [
    {
      name: "Test 1",
      price: "13.10",
      category: "Main",
      checked: false,
      date_added: new Date("2029-01-22T16:28:32.615Z"),
      product_id: 1
    },
    {
      name: "Test 2",
      price: "4.99",
      category: "Snack",
      checked: true,
      date_added: new Date("2020-01-22T16:28:32.615Z"),
      product_id: 2
    },
    {
      name: "Test 3",
      price: "5.50",
      category: "Snack",
      checked: false,
      date_added: new Date("2023-01-22T16:28:32.615Z"),
      product_id: 3
    }
  ];

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
  });

  before(() => db("shopping_list").truncate());

  afterEach(() => db("shopping_list").truncate());

  after(() => db.destroy());

  context(`Given 'shopping_list' has data`, () => {
    beforeEach(() => {
      return db.into("shopping_list").insert(testItems);
    });

    it('getAllItems() resolves all items from "shopping_list" table', () => {
      return ShoppingListService.getAllItems(db).then(actual => {
        expect(actual).to.eql(testItems);
      });
    });

    it(`getById() resolves an item by id from 'shopping_list' table`, () => {
      const thirdId = 3;
      const thirdTestItem = testItems[thirdId - 1];
      return ShoppingListService.getById(db, thirdId).then(actual => {
        expect(actual).to.eql({
          product_id: thirdId,
          name: thirdTestItem.name,
          price: thirdTestItem.price,
          category: thirdTestItem.category,
          checked: thirdTestItem.checked,
          date_added: thirdTestItem.date_added
        });
      });
    });

    it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
      const itemId = 3;
      return ShoppingListService.deleteItem(db, itemId)
        .then(() => ShoppingListService.getAllItems(db))
        .then(allItems => {
          const expected = testItems.filter(item => item.product_id !== itemId);
          expect(allItems).to.eql(expected);
        });
    });

    it(`updateItem() updates an item from the 'shopping_list' table`, () => {
      const idOfItemToUpdate = 3;
      const newItemData = {
        name: "Updated Name",
        price: "2.99",
        category: "Snack",
        checked: false,
        date_added: new Date()
      };
      return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
        .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
        .then(item => {
          expect(item).to.eql({
            product_id: idOfItemToUpdate,
            ...newItemData
          });
        });
    });
  });

  context(`Given 'shopping_list has no data`, () => {
    it(`getAllItems() resolves an empty array`, () => {
      return ShoppingListService.getAllItems(db).then(actual => {
        expect(actual).to.eql([]);
      });
    });

    it(`insertItem() inserts a new item and resolves new item with an 'id'`, () => {
      const newItem = {
        name: "Test new name",
        price: "2.99",
        category: "Snack",
        checked: true,
        date_added: new Date("2020-01-01T00:00:00.000Z")
      };
      return ShoppingListService.insertItem(db, newItem).then(actual => {
        expect(actual).to.eql({
          product_id: 1,
          name: newItem.name,
          price: newItem.price,
          category: newItem.category,
          checked: newItem.checked,
          date_added: newItem.date_added
        });
      });
    });
  });
});
