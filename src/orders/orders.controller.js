const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
function list(req, res) {
    res.json({ data: dishes });
}

function create(req, res) {
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
    const newOrder = {
        id: nextId(),
        deliverTo,
        mobileNumber,
        status,
        dishes: [...dishes]
    };
    dishes.push(newOrder);
    res.status(201).json({ data: newOrder });
}

function read(req, res) {
    res.json({ data: res.locals.orders });
}

function update(req, res) {
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
    const updateOrders = {
        ...res.locals.orders,
        deliverTo,
        mobileNumber,
        status,
        dishes: [...dishes]
    };
    res.json({ updateOrders });
}

function destroy(req, res) {
    const { orderId } = req.params;
    const index = orders.findIndex((order) => order.id === orderId);
    if (index > -1) {
        orders.splice(index, 1);
    }
    res.sendStatus(204);
}

//middlewear
function hasNeededContent(req, res, next) {
    const { data: { deliverTo, mobileNumber, status, dishes  } = {} } = req.body;
    const neededContent = [deliverTo, mobileNumber, status, dishes ];
    for (const content of neededContent) {
        if (!req.body.date[content]) {
        next({ status: 400, message: `A '${content}' property is needed.` });
        }
    }
    next();
}
//middlewear
function validateDishes(req, res, next) {
        const { data: { dishes } = {} } = req.body;
        if (!Array.isArray(dishes)) {
            return res.status(400).json({ error: 'dishes must be an array' });
        }
        if (dishes.length < 1) {
            return res.status(400).json({ error: 'dishes must be greater than one' })
        }
        next();
    }
