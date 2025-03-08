import mongoose, { Schema, Document } from 'mongoose';

interface IExperience extends Document {
  company: string;
  position: string;
  start: string;
  end: string;
}

const experienceSchema: Schema = new Schema({
    company:{type: String, required: true},
    start:{type: String, required: true},
    end:{type: String, required: true},
    position:{type: String, required: true},
});

const Experience = mongoose.models.Experience|| mongoose.model<IExperience>('Experience', experienceSchema);

export default Experience;