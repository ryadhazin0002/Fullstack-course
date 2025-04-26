import express from 'express';
import ProjectAssignment from '../model/ProjectAssignment.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try{
        const assignment = new ProjectAssignment(req.body);
        await assignment.save();
        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
    });

router.get('/', async (req, res) => {
    try{
        const assignments = await ProjectAssignment.find()
            .populate('employee')
            .populate('project');
        res.json(assignments);

    }catch (error) {
        res.status(500).json({message: error.message});
        }
    });

export default router;