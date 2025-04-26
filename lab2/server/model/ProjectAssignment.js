import mongoose from 'mongoose';

const projectAssignmentSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employees', required: true},
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'projects', required: true },
    start_date: { type: Date, required: true }
});

export default mongoose.model('projectassignments', projectAssignmentSchema);