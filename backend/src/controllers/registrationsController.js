const { StudentRegistration } = require('../models');

async function createRegistration(req, res) {
  const { studentId, firstName, lastName, email, phone, program, intakeYear, department } = req.body;
  if (!firstName || !lastName || !email) return res.status(400).json({ message: 'Missing required fields' });

  const reg = await StudentRegistration.create({
    user: req.user.id,
    studentId,
    firstName,
    lastName,
    email,
    phone,
    program,
    intakeYear,
    department
  });

  try {
    const io = req.app && req.app.get && req.app.get('io')
    if (io) io.emit('registration:created', reg)
  } catch (err) {}

  res.status(201).json(reg);
}

async function listRegistrations(req, res) {
  if (req.user.role === 'admin') {
    const items = await StudentRegistration.find().sort({ createdAt: -1 });
    return res.json(items);
  }

  const items = await StudentRegistration.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(items);
}

async function getRegistration(req, res) {
  const { id } = req.params
  const reg = await StudentRegistration.findById(id)
  if (!reg) return res.status(404).json({ message: 'Not found' })

  // only owner or admin can view
  if (req.user.role !== 'admin' && String(reg.user) !== String(req.user.id)) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  res.json(reg)
}

async function updateRegistration(req, res) {
  const { id } = req.params
  const reg = await StudentRegistration.findById(id)
  if (!reg) return res.status(404).json({ message: 'Not found' })

  if (req.user.role !== 'admin' && String(reg.user) !== String(req.user.id)) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const allowed = ['studentId','firstName','lastName','email','phone','program','intakeYear','department']
  allowed.forEach(k => {
    if (req.body[k] !== undefined) reg[k] = req.body[k]
  })

  await reg.save()

  try {
    const io = req.app && req.app.get && req.app.get('io')
    if (io) io.emit('registration:updated', reg)
  } catch (err) {}

  res.json(reg)
}

async function stats(req, res) {
  const total = await StudentRegistration.countDocuments();
  const byDepartmentAgg = await StudentRegistration.aggregate([
    { $group: { _id: '$department', count: { $sum: 1 } } }
  ]);

  res.json({ total, byDepartment: byDepartmentAgg });
}

module.exports = { createRegistration, listRegistrations, getRegistration, updateRegistration, stats };
