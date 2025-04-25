import monngoose from 'mongoose';

const employeeSchema = new monngoose.Schema({
    employee_id: {type: String, required: true, unique: true},
    full_name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    hashed_password: {type: String}
});

module.exports = monngoose.model('Employee', employeeSchema);