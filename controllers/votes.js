const Joi = require('joi');
const db = require('../config/db');

const Vote = db.models.vote;

async function createVote(call, callback) {
  const { voter, entry, type } = call.request;

  try {
    const schema = Joi.object()
      .keys({
        voter: Joi.string().required(),
        entry: Joi.string().required(),
        type: Joi.string()
          .valid(['up', 'down'])
          .required(),
      })
      .unknown(true);
    const validation = Joi.validate(call.request, schema);
    if (validation.error !== null) throw new Error(validation.error.details[0].message);

    const data = new Vote();
    if (voter !== undefined) data.voter = voter;
    if (entry !== undefined) data.entry = entry;
    if (type !== undefined) data.type = type;

    await data.save();

    callback(null, { data: JSON.stringify(data) });
  } catch (error) {
    console.error(error);
    callback(error);
  }
}

async function getVoteByID(call, callback) {
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

    const data = await Vote.findOne(match);

    if (!data) {
      callback(null, { error: 'Vote not found' });
      return;
    }

    callback(null, {
      data: JSON.stringify(data),
    });
  } catch (error) {
    console.error(error);
    callback(error);
  }
}

async function getAllVotes(call, callback) {
  const {
    voter, entry, type, deleted,
  } = call.request;

  try {
    const schema = Joi.object().keys({
      voter: Joi.string().optional(),
      entry: Joi.string().optional(),
      type: Joi.string()
        .valid(['up', 'down'])
        .optional(),
      deleted: Joi.bool(),
    });
    const validation = Joi.validate(call.request, schema);
    if (validation.error !== null) throw new Error(validation.error.details[0].message);

    const match = {};
    if (voter !== undefined) match.voter = voter;
    if (entry !== undefined) match.entry = entry;
    if (type !== undefined) match.type = type;
    if (deleted !== undefined) match.deleted = deleted;

    const data = await Vote.find(match);
    callback(null, { data: JSON.stringify(data) });
  } catch (error) {
    console.error(error);
    callback(error);
  }
}

async function updateVote(call, callback) {
  const {
    id, voter, entry, type,
  } = call.request;

  try {
    const schema = Joi.object()
      .keys({
        id: Joi.string().required(),
        voter: Joi.string().optional(),
        entry: Joi.string().optional(),
        type: Joi.string()
          .valid(['up', 'down'])
          .optional(),
      })
      .unknown(true);

    const validation = Joi.validate(call.request, schema);
    if (validation.error !== null) throw new Error(validation.error.details[0].message);

    const data = await Vote.findById(id);

    if (!data) {
      callback(null, { error: 'Vote not found' });
      return;
    }

    if (voter !== undefined) data.voter = voter;
    if (entry !== undefined) data.entry = entry;
    if (type !== undefined) data.type = type;
    await data.save();

    callback(null, { data: JSON.stringify(data) });
  } catch (error) {
    console.error(error);
    callback(error);
  }
}

async function deleteVoteByID(call, callback) {
  const { id } = call.request;

  try {
    const schema = Joi.object().keys({ id: Joi.string().required() });
    const validation = Joi.validate(call.request, schema);
    if (validation.error !== null) throw new Error(validation.error.details[0].message);

    await Vote.delete({ _id: id });

    callback(null, {});
  } catch (err) {
    console.error(err);
    callback(err);
  }
}

module.exports = {
  getAllVotes,
  getVoteByID,
  deleteVoteByID,
  createVote,
  updateVote,
};
