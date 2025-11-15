const { User } = require('../models');

async function getMe(req, res) {
  const user = await User.findById(req.user.id).select('-passwordHash');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
}

async function updateMe(req, res) {
  const { firstName, lastName, email } = req.body;
  const updates = {};
  if (firstName) updates.firstName = firstName;
  if (lastName) updates.lastName = lastName;
  if (email) updates.email = email;

  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-passwordHash');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
}

module.exports = { getMe, updateMe };
