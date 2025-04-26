import mongoose from 'mongoose';

// Define the schema for the projectAssignment collection
const projectAssignmentSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employees', required: true},
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'projects', required: true },
    start_date: { type: Date, required: true }
});

// Create a model from the schema
export default mongoose.model('projectassignments', projectAssignmentSchema);