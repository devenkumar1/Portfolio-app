import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends Document {
  email: string;
  password: string;
  name: string;
  role: string; // 'admin' or 'user'
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const adminSchema: Schema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
}, { timestamps: true });

// Hash password before saving
adminSchema.pre<IAdmin>('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password along with the new salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password for login
adminSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Rename the model to User since it now handles both admins and regular users
const User = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', adminSchema);

export default User; 