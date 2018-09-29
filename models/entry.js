const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const EntrySchema = new Schema(
  {
    name: { type: String, required: true },
    meaning: { type: String, required: true },
    example: { type: String },
    tags: [{ type: String }],
    image: { type: String },
    author: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true },
);

EntrySchema.plugin(mongooseDelete);

module.exports = EntrySchema;
