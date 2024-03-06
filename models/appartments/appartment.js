const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../../helpers");

const appartmentSchema = new Schema(
  {
    picture: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      // pass an array of countries enum:[]
    },
    city: {
      type: String,
      required: true,
      // pass an array of cities enum:[]
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

appartmentSchema.post("save",handleMongooseError )

const Appartment = model("appartment", appartmentSchema);

module.exports = Appartment;
