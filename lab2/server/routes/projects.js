import express from 'express';
import Project from '../model/Project.js';

// Define the routes for the project collection
const router = express.Router();

// POST /api/projects
router.post('/', async (req, res) => {
    try{
        const existing = await Project.findOne({project_code: req.query.project_code});
        if(existing){
            return res.status(409).json({message: 'Project already exists'});
        }

        const project = new Project(req.body);
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
);


// export project router
export default router;
