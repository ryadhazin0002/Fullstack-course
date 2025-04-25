import mongoose from 'mongoose';
import bycrypt from 'bcrypt';
import Employee from './model/Employee.js';
import Project from './model/Project.js';
import ProjectAssignment from './model/ProjectAssignment.js';


const MONGO_URI = process.env.MONGO_URI

async function seedDatabase() {
    try{
        await mongoose.connect(MONGO_URI)
        console.log('connected succssessful to MongoDB' );
        
        await Employee.deleteMany({});
        await Project.deleteMany({});
        await ProjectAssignment.deleteMany({});

        const plainPasswords = [
            'ryad123',
            'mustafa123',
            'daniel123',
            'sergej123',
            'patric123'
        ];
        const hashed_passwords = await Promise.all
        plainPasswords.map(password => bycrypt.hash(password, 10));


        const employees = await Employee.insertMany([
            {employee_id: 'E001', full_name: 'Ryad hkr', email: 'ryad@hkr.se', hashed_password: hashed_passwords[0]},
            {employee_id: 'E002', full_name: 'Mustafa hkr', email: 'mustafa.hkr.se', hashed_password: hashed_passwords[1]},
            {employee_id: 'E003', full_name: 'Daniel hkr', email: 'daniel@hkr.se', hashed_password: hashed_passwords[2]},
            {employee_id: 'E004', full_name: 'Sergej hkr', email: 'sergej@hkr.se', hashed_password: hashed_passwords[3]},
            {employee_id: 'E005', full_name: 'Patric hkr', email: 'patric@hkr.se', hashed_password: hashed_passwords[4]}
        ]);

        const projects = await Project.insertMany([
            {project_code: 'P001', project_name: 'Project A', project_description: 'Description for Project A'},
            {project_code: 'P002', project_name: 'Project B', project_description: 'Description for Project B'},
            {project_code: 'P003', project_name: 'Project C', project_description: 'Description for Project C'},
            {project_code: 'P004', project_name: 'Project D', project_description: 'Description for Project D'},
            {project_code: 'P005', project_name: 'Project E', project_description: 'Description for Project E'}
        ]);

        const projectAssignments = await ProjectAssignment.insertMany([
            {employee: employees[0]._id, project: projects[0]._id, start_date: new Date('2023-01-01')},
            {employee: employees[1]._id, project: projects[1]._id, start_date: new Date('2023-02-01')},
            {employee: employees[2]._id, project: projects[2]._id, start_date: new Date('2023-03-01')},
            {employee: employees[3]._id, project: projects[3]._id, start_date: new Date('2023-04-01')},
            {employee: employees[4]._id, project: projects[4]._id, start_date: new Date('2023-05-01')}
        ]);
        console.log('Database seeded successfully');
        process.exit();
        
    }catch (error) {
        console.error('Error seeding database:', error);
            process.exit(1);
        
        }
    }