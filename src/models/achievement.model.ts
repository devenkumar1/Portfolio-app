
import mongoose, { Schema, Document } from 'mongoose';

interface IAchievement extends Document {
year: string;
title: string;
description: string;
}

const achievementSchema: Schema = new Schema({
    year:{type: String, required: true},
    title:{type: String, required: true},
    description:{type: String, required: true},
});

const Achievement = mongoose.models.Achievement|| mongoose.model<IAchievement>('Achievement', achievementSchema);

export default Achievement;
