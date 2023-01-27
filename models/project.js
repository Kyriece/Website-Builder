import mongoose from 'mongoose';

const Project = mongoose.model('Project', new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}));

export async function createOne(data) {
  const project = new Project(data);
  try {
    return await project.save();
  } catch (error) {
    throw new Error(error);
  }
}

export async function find(query={}) {
  try {
    return await Project.find(query);
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateOne(query, update) {
  try {
    return await Project.findOneAndUpdate(query, update, { new: true });
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteOne(query) {
  try {
    return await Project.findOneAndDelete(query);
  } catch (error) {
    throw new Error(error);
  }
}