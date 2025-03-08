import mongoose, { Schema, Document } from 'mongoose';

interface IContact extends Document {
  email: string;
  phone: string;
  address: string;
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
}

const contactSchema: Schema = new Schema({
  email: { type: String, required: true },
  phone: { type: String, required: false },
  address: { type: String, required: false },
  github: { type: String, required: false },
  linkedin: { type: String, required: false },
  twitter: { type: String, required: false },
  instagram: { type: String, required: false },
});

// Since there should only be one contact, we'll use a singleton pattern
contactSchema.statics.findOneOrCreate = async function(contactData: any) {
  const contact = await this.findOne();
  if (contact) {
    return contact;
  }
  return this.create(contactData);
};

const Contact = mongoose.models.Contact || mongoose.model<IContact>('Contact', contactSchema);

export default Contact; 