/**
 * User model.
 *
 * Password hashing is done in a pre-save hook rather than in the service
 * layer. Reasoning: this makes "a saved User document always has a hashed
 * password" an invariant of the model itself - true no matter what code
 * path creates or updates a user, now or in the future.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name must be at most 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // never returned by default on queries (find, findOne, etc.)
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  // Only re-hash if the password field was actually changed
  // (avoids re-hashing an already-hashed password on unrelated updates).
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method: compare a plaintext candidate password against the stored hash.
userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Never let the password hash leak out through JSON responses,
// even if a route accidentally does `res.json(userDoc)` directly.
userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
