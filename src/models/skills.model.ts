import mongoose, { Schema, Document } from 'mongoose';

interface ISkills extends Document {
  name: string;
  icon: string;
}

const skillSchema: Schema = new Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
});

const Skills = mongoose.models.Skill || mongoose.model<ISkills>('Skill', skillSchema);

export default Skills;

