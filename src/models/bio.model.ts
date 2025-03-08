import mongoose, { Schema, Document } from 'mongoose';

interface IBio extends Document {
  name: string;
  title: string;
  description: string;
  image: string;
  resume: string;
}

const bioSchema: Schema = new Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  resume: { type: String, required: false },
});

// Since there should only be one bio, we'll use a singleton pattern
bioSchema.statics.findOneOrCreate = async function(bioData: any) {
  const bio = await this.findOne();
  if (bio) {
    return bio;
  }
  return this.create(bioData);
};

const Bio = mongoose.models.Bio || mongoose.model<IBio>('Bio', bioSchema);

export default Bio; 