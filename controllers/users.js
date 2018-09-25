const Joi = require('joi');
const db = require('../config/db');

const User = db.models.user;

async function createUser(call, callback) {
  const { username } = call.request;

  try {
    const schema = Joi.object().keys({
      username: Joi.string().required(),
    });
    const validation = Joi.validate(call.request, schema);
    if (validation.error !== null) throw new Error(validation.error.details[0].message);

    const data = new User();
    if (username !== undefined) data.username = username;

    await data.save();

    callback(null, { data: JSON.stringify(data) });
  } catch (error) {
    console.error(error);
    callback(error);
  }
}

async function getUserByID(call, callback) {
  const { id, deleted } = call.request;
  try {
    const schema = Joi.object().keys({
      id: Joi.string().required(),
      deleted: Joi.bool().optional(),
    });
    const validation = Joi.validate(call.request, schema);
    if (validation.error !== null) throw new Error(validation.error.details[0].message);

    const match = {};
    if (id !== undefined) match._id = id;
    if (deleted !== undefined) match.deleted = deleted;

    const data = await User.findOne(match);

    if (!data) {
      callback(null, { error: 'User not found' });
      return;
    }

    callback(null, {
      success: true,
      data: JSON.stringify(data),
    });
  } catch (error) {
    console.error(error);
    callback(error);
  }
}

async function getAllUsers(call, callback) {
  // const {} = call.request;

  try {
    const schema = Joi.object().keys({
      // param: Joi.string().required(),
    });
    const validation = Joi.validate(call.request, schema);
    if (validation.error !== null) throw new Error(validation.error.details[0].message);

    const filters = {};
    // if (param !== undefined) filters.param = param;

    const data = await User.find(filters);
    callback(null, { data: JSON.stringify(data) });
  } catch (error) {
    console.error(error);
    callback(error);
  }
}

async function updateUser(call, callback) {
  const { id, username } = call.request;

  try {
    const schema = Joi.object().keys({
      id: Joi.string().required(),
      username: Joi.string().optional(),
    });

    const validation = Joi.validate(call.request, schema);
    if (validation.error !== null) throw new Error(validation.error.details[0].message);

    const data = await User.findById(id);

    if (!data) {
      callback(null, { success: false, message: 'Not found' });
      return;
    }

    if (username !== undefined) data.username = username;
    await data.save();

    callback(null, { data: JSON.stringify(data) });
  } catch (error) {
    console.error(error);
    callback(error);
  }
}

async function deleteUserByID(call, callback) {
  const { id } = call.request;

  try {
    const schema = Joi.object().keys({ id: Joi.string().required() });
    const validation = Joi.validate(call.request, schema);
    if (validation.error !== null) throw new Error(validation.error.details[0].message);

    await User.delete({ _id: id });

    callback(null);
  } catch (err) {
    console.error(err);
    callback(err);
  }
}

async function getUserByUsername(call, callback) {
  const { username, deleted } = call.request;
  try {
    const schema = Joi.object().keys({
      username: Joi.string().required(),
      deleted: Joi.bool().optional(),
    });
    const validation = Joi.validate(call.request, schema);
    if (validation.error !== null) throw new Error(validation.error.details[0].message);

    const match = {};
    if (username !== undefined) match.username = username;
    if (deleted !== undefined) match.deleted = deleted;

    const data = await User.findOne(match);

    if (!data) {
      callback(null, { error: 'User not found' });
      return;
    }

    callback(null, {
      success: true,
      data: JSON.stringify(data),
    });
  } catch (error) {
    console.error(error);
    callback(error);
  }
}

module.exports = {
  getAllUsers,
  getUserByID,
  deleteUserByID,
  createUser,
  updateUser,
  getUserByUsername,
};
