var Food = require('./models/food');

function getFood(res) {
    Food.find(function (err, food) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(food); // return all food in JSON format
    });
};

function getTotalCost(res) {
    Food.find(function(err, food) {
        if (err) {
            res.send(err);
        }

        var subtotal = 0;

        for (var i = 0; i < food.length; i++) {
            subtotal += food[i].price * food[i].quantity;
        }

        var totalCost = subtotal * 1.075;

        res.json(totalCost);
    });
}

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all food
    app.get('/api/food', function (req, res) {
        // use mongoose to get all food in the database
        getFood(res);
    });

    // create food item and send back all food after creation
    app.post('/api/food', function (req, res) {

        // create a food item, information comes from AJAX request from Angular
        Food.findOneAndUpdate({
            text: req.body.text,
            price: req.body.price
        }, {
            quantity: req.body.quantity,
            done: false
        }, {
            upsert: true
        }, function (err, food) {
            if (err)
                res.send(err);

            // get and return all the food after you create another
            getFood(res);
        });

    });

    // delete a food item
    app.delete('/api/food/:food_id', function (req, res) {
        Food.remove({
            _id: req.params.food_id
        }, function (err, food) {
            if (err)
                res.send(err);

            getFood(res);
        });
    });

    //calculate total price of food
    app.get('/api/total', function(req, res) {
        getTotalCost(res);
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};