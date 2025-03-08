import mongoose, { Schema, Document } from 'mongoose';

interface IEducation extends Document {
  course: string;
  start: string;
  end: string;
  percentage: number;
}

const educationSchema: Schema = new Schema({
    course:{type: String, required: true},
    start:{type: String, required: true},
    end:{type: String, required: true},
    percentage:{type: Number, required: true},
});

const Education = mongoose.models.Education || mongoose.model<IEducation>('Education', educationSchema);

export default Education;
