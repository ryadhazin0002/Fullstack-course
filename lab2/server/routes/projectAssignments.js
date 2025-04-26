import express from 'express';
import ProjectAssignment from '../model/ProjectAssignment.js';

// Define the routes for the projectAssignment collection
const router = express.Router();

// POST /api/project-assignments
router.post('/', async (req, res) => {
    try{
        const assignment = new ProjectAssignment(req.body);
        await assignment.save();
        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
    });

// GET /api/project-assignments
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

// export the projectAssignment router
export default router;