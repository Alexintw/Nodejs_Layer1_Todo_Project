const Todo = require('../models/todo');

exports.list = async (req, res) => {
  const all = await Todo.find();
  res.json(all);
};

exports.create = async (req, res) => {
  const doc = await Todo.create({ text: req.body.text });
  res.status(201).json(doc);
};

exports.getById = async (req, res) => {
  const doc = await Todo.findById(req.params.id);
  if (!doc) return res.status(404).end();
  res.json(doc);
};

exports.update = async (req, res) => {
  const doc = await Todo.findByIdAndUpdate(
    req.params.id,
    { text: req.body.text, done: req.body.done },
    { new: true }
  );
  if (!doc) return res.status(404).end();
  res.json(doc);
};

exports.remove = async (req, res) => {
  const doc = await Todo.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).end();
  res.status(204).end();
};
