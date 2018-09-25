const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

UserSchema.plugin(mongooseDelete);

module.exports = UserSchema;
