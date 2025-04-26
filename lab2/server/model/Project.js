import mongoose from 'mongoose';

// Define the schema for the project collection
const projectSchema = new mongoose.Schema({
    project_code: { type: String, required: true, unique: true },
    project_name: { type: String, required: true },
    project_description: { type: String }
});


// Create a model from the schema
export default mongoose.model('projects', projectSchema);