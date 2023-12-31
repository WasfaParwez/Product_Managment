const mongoose = require('mongoose');

const UserModel = mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profileImage: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true},
  address: {
    shipping: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true }
    },
    billing: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true }
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserModel);
