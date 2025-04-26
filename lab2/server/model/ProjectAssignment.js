import mongoose from 'mongoose';

const projectAssignmentSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    start_date: { type: Date, required: true }
});

export default mongoose.model('ProjectAssignment', projectAssignmentSchema);