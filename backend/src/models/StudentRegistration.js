const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    studentId: { type: String, required: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: false, trim: true },
    program: { type: String, required: true, default: 'Business Intelligence with Technology' },
    intakeYear: { type: Number, required: false },
    status: { type: String, enum: ['pending','confirmed','cancelled'], default: 'pending' },
    department: { type: String, enum: ['Accountancy','ICT & Mathematics','Business Administration','Procurement & Logistic','Marketing'], required: false }
  },
  { timestamps: true }
);

registrationSchema.index({ email: 1 });
registrationSchema.index({ program: 1 });

module.exports = mongoose.model('StudentRegistration', registrationSchema);
