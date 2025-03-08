import mongoose, { Schema, Document } from 'mongoose';

interface IProject extends Document {
  title: string;
  category: string;
  description: string;
  image: string;
  timestamp: Date;
}

const projectSchema: Schema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  descrition: { type: String, required: true },
  image: { type: String, required: true },
  timestamp: { type: Date, required: true},
});

const Project = mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema);

export default Project;
