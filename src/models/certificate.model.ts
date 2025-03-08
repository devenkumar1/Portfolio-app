
import mongoose, { Schema, Document } from 'mongoose';

interface ICertificate extends Document {
title: string;
platform: string;
timestamp: Date;
}

const certificateSchema: Schema = new Schema({
    title:{type: String, required: true},
    timestamp:{type: Date, required: true},
    platform:{type: String, required: true},
});

const Certificate = mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', certificateSchema);

export default Certificate;
