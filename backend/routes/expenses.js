const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  const { description, amount, splitAmong } = req.body;
  const paidBy = req.userId;
  const expense = new Expense({ description, amount, paidBy, splitAmong });
  await expense.save();
  res.status(201).json(expense);
});

router.get("/", auth, async (req, res) => {
  const expenses = await Expense.find().populate("paidBy", "name email");
  res.status(200).json(expenses);
});

router.delete('/:id', auth, async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id)
  res.status(200).json({ message: "Expense deleted" })
})

module.exports = router;
