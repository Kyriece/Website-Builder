import mongoose from 'mongoose';

const User = mongoose.model('User', new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}));

export async function createOne(data) {
  const user = new User(data);
  try {
    return await user.save();
  } catch (error) {
    throw new Error(error);
  }
}

export async function find(query={}) {
  try {
    return await User.find(query);
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateOne(query, update) {
  try {
    return await User.findOneAndUpdate(query, update, { new: true });
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteOne(query) {
  try {
    return await User.findOneAndDelete(query);
  } catch (error) {
    throw new Error(error);
  }
}