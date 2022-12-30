const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
function list(req, res) {
  res.json({ data: dishes });
}

function create(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const newDish = {
    id: nextId(),
    name,
    description,
    price,
    image_url,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

function read(req, res) {
  res.json({ data: res.locals.dish });
}

function update(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const updateDish = {
    ...res.locals.dish,
    name,
    description,
    price,
    image_url,
  };
  res.json({ updateDish });
}

//middlewear
function hasNeededContent(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const neededContent = [name, description, price, image_url];
  for (const content of neededContent) {
    if (!req.body.date[content]) {
      next({ status: 400, message: `A '${content}' property is needed.` });
    }
  }
  next();
}

//middlewear
function validatePrice(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  if (typeof price !== "number") {
    return res.status(400).json({ error: "price must be a number" });
  }
  if (price < 0) {
    return res
      .status(400)
      .json({ error: "price must be a number greater than zero" });
  }
  next();
}

// middleware
function dishExists(req, res, next) {
  const dishId = req.params.dishId;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    res.locals.dish = foundDish;
    return next();
  }
  next({
    status: 404,
    message: `dish id not found: ${req.params.dishId}`,
  });
}
//middleware
function validateId(req, res, next) {
  const dishId = req.params.dishId;
  const {
    data: { id },
  } = req.body;
  if (id) {
    if (dishId !== id) {
      next({
        status: 400,
        message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
      });
    }
  }
  next();
}

module.exports = {
  list,
  create: [hasRequiredFields, validatePrice, create],
  read: [dishExists, read],
  update: [dishExists, hasRequiredFields, validatePrice, validateId, update],
};