var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  promptUser();
})

function promptUser() {

  inquirer
    .prompt({
//    * The first should ask them the ID of the product they would like to buy.
//    * The second message should ask how many units of the product they would like to buy.
      name: "productID",
      type: "list",
      message: "What awesomeness would you like to purchase?",
      choices: ['household', 'toy', 'food', 'clothing']
    }).then(function(answer) {
      var query = "SELECT product_name FROM products WHERE department_name = ?";
      connection.query(query, [answer.productID] , function(err, res) {
        var responseList = [];
        for(var i = 0; i < res.length; i++) {
          responseList.push(res[i].product_name);
        };
        inquirer
          .prompt({
            name: "product_name",
            type: "list",
            message: "Cool Yo, here's what we got!",
            choices: responseList

          }).then(function(answer) {

            var selection = answer;
            var query = "SELECT price FROM products WHERE product_name = ?";
            connection.query(query, [answer.product_name] , function(err, res) {
              var newResponse = res[0].price;

              inquirer
                .prompt({
                  name: "stock_quantity",
                  type: "list",
                  message: "That'll be " + newResponse + "$",
                  choices: ["Sounds good, dude", "No way man! That's too expensive!"]

                }).then(function(answer) {
                  if(answer.stock_quantity == "No way man! That's too expensive!") {
                    console.log("Oh! Sorry dude...Why don't you check out what else we have then?!")
                    promptUser();
                  } else {

                    var purchaseSelection = selection.product_name;
                    var query = "SELECT stock_quantity FROM products WHERE product_name = ?";

                    connection.query(query, [purchaseSelection], function(err, res) {
                      var quantityList = [];
                      // console.log(res[0].stock_quantity);

                      for(var i = 1; i < res[0].stock_quantity; i++) {
                        quantityList.push(i);
                      };
                      quantityList.push(res[0].stock_quantity);
                      
                      var passQuantity = quantityList.map(String);

                      if(quantityList.indexOf(0) == 0) {
                        console.log("Oh man...looks like we are out. Sorry! Lets try something else");
                        promptUser();
                      } else {
                        inquirer
                          .prompt({
                            name: "amount", 
                            type: "list",
                            message: "How many would you like? We've got a limited amount...",
                            choices: passQuantity
                          }).then(function(answer) {
                              var query = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_name = ?";

                              connection.query(query, [answer.amount, purchaseSelection], function(err, res) {
                                inquirer
                                  .prompt({
                                    name: "finish", 
                                    type: "list",
                                    message: "Alright man! Looks like we are all done here, unless you want to make another purchase?...",
                                    choices: ["Sure do!", "Nah, I'm set. Thanks!"]
                                  }).then(function(answer) {
                                    if(finish.answer == "Sure do!") {
                                      promptUser();
                                    } else {
                                      console.log("Later!")
                                    };
                                });
                            });
                          })
                        };
                    });

                };

            });
          });
          
        });
    });
  });
};


// - - -

// ### Challenge #2: Manager View (Next Level)

// * Create a new Node application called `bamazonManager.js`. Running this application will:

//   * List a set of menu options:

//     * View Products for Sale
    
//     * View Low Inventory
    
//     * Add to Inventory
    
//     * Add New Product

//   * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

//   * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

//   * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

//   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

// - - -

// * If you finished Challenge #2 and put in all the hours you were willing to spend on this activity, then rest easy! Otherwise continue to the next and final challenge.
