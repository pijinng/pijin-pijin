const Joi = require('joi');
const db = require('../config/db');

const Entry = db.models.entry;

async function createEntry(call, callback) {
  const {
    name, meaning, example, tags, image, author,
  } = call.request;

  try {
    const tagsList = JSON.parse(tags);

    const schema = Joi.object()
      .keys({
        name: Joi.string().required(),
        meaning: Joi.string().required(),
        example: Joi.string(),
        tagsList: Joi.array().items(Joi.string()),
        image: Joi.string().uri(),
        author: Joi.string().required(),
      })
      .unknown(true);
    const validation = Joi.validate({ ...call.request, ...tagsList }, schema);
    if (validation.error !== null) throw new Error(validation.error.details[0].message);

    const data = new Entry();
    if (name !== undefined) data.name = name;
    if (meaning !== undefined) data.meaning = meaning;
    if (example !== undefined) data.example = example;
    if (tagsList !== undefined) data.tags = tagsList;
    if (image !== undefined) data.image = image;
    if (author !== undefined) data.author = author;

    await data.save();

    callback(null, { data: JSON.stringify(data) });
  } catch (error) {
    console.error(error);
    callback(error);
  }
}

async function getEntryByID(call, callback) {
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

    const data = await Entry.findOne(match);

    if (!data) {
      callback(null, { error: 'Entry not found' });
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

async function getAllEntries(call, callback) {
  const { author, deleted } = call.request;

  try {
    const schema = Joi.object().keys({
      author: Joi.string(),
      deleted: Joi.bool(),
    });
    const validation = Joi.validate(call.request, schema);
    if (validation.error !== null) throw new Error(validation.error.details[0].message);

    const match = {};
    if (author !== undefined) match.author = author;
    if (deleted !== undefined) match.deleted = deleted;

    const data = await Entry.find(match);
    callback(null, { data: JSON.stringify(data) });
  } catch (error) {
    console.error(error);
    callback(error);
  }
}

async function updateEntry(call, callback) {
  const {
    id, name, meaning, example, tags, image,
  } = call.request;

  try {
    const schema = Joi.object().keys({
      id: Joi.string().required(),
      name: Joi.string(),
      meaning: Joi.string(),
      example: Joi.string(),
      tags: Joi.array().items(Joi.string()),
      image: Joi.string().uri(),
    });

    const validation = Joi.validate(call.request, schema);
    if (validation.error !== null) throw new Error(validation.error.details[0].message);

    const data = await Entry.findById(id);

    if (!data) {
      callback(null, { error: 'Entry not found' });
      return;
    }

    if (name !== undefined) data.name = name;
    if (meaning !== undefined) data.meaning = meaning;
    if (example !== undefined) data.example = example;
    if (tags !== undefined) data.tags = tags;
    if (image !== undefined) data.image = image;
    await data.save();

    callback(null, { data: JSON.stringify(data) });
  } catch (error) {
    console.error(error);
    callback(error);
  }
}

async function deleteEntryByID(call, callback) {
  const { id } = call.request;

  try {
    const schema = Joi.object().keys({ id: Joi.string().required() });
    const validation = Joi.validate(call.request, schema);
    if (validation.error !== null) throw new Error(validation.error.details[0].message);

    await Entry.delete({ _id: id });

    callback(null);
  } catch (err) {
    console.error(err);
    callback(err);
  }
}

module.exports = {
  getAllEntries,
  getEntryByID,
  deleteEntryByID,
  createEntry,
  updateEntry,
};
