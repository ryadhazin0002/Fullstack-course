import mongoose from 'mongoose';

// Define the schema for the employee collection
const employeeSchema = new mongoose.Schema({
    employee_id: { type: String, required: true, unique: true },
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashed_password: { type: String }
});

// Create a model from the schema
export default mongoose.model('employees', employeeSchema);