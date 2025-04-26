import express from 'express';
import employee from '../model/Employee.js';
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const existing = await employee.findOne({ employee_id: req.body.employee_id });
        if (existing) {
            return res.status(409).json({ message: 'Employee already exists' });
        }
        const newEmployee = new employee(req.body);
        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export default router;
