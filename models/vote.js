const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const VoteSchema = new Schema(
  {
    voter: { type: Schema.Types.ObjectId, required: true },
    entry: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ['up', 'down'], required: true },
  },
  { timestamps: true },
);

VoteSchema.plugin(mongooseDelete);

module.exports = VoteSchema;
