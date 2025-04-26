import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AssignmentTable() {
    const [data, setData] = useState([]);
    const [sortField, setSortField] = useState("start_date");
    const [sortOrder, setSortOrder] = useState("asc");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = React.useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/api/project-assignments');
            
            const sortedData = res.data.sort((a, b) => {
                let valA, valB;
                
                if (sortField.includes('employee')) {
                    const field = sortField.split('.')[1];
                    valA = a.employee[field];
                    valB = b.employee[field];
                } 
                else if (sortField.includes('project')) {
                    const field = sortField.split('.')[1];
                    valA = a.project[field];
                    valB = b.project[field];
                } 
                else {
                    valA = a[sortField];
                    valB = b[sortField];
                }

                if (typeof valA === 'string') valA = valA.toLowerCase();
                if (typeof valB === 'string') valB = valB.toLowerCase();

                return sortOrder === 'asc' 
                    ? valA > valB ? 1 : -1 
                    : valA < valB ? 1 : -1;
                    });
            setData(sortedData.slice(0, 5));
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [sortField, sortOrder]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, [fetchData, sortField, sortOrder]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <table>
            <thead>
                <tr>
                    <th onClick={() => handleSort('employee.employee_id')}>
                        Employee ID {sortField === 'employee.employee_id' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th onClick={() => handleSort('employee.full_name')}>
                        Employee Name {sortField === 'employee.full_name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th onClick={() => handleSort('project.project_name')}>
                        Project Name {sortField === 'project.project_name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th onClick={() => handleSort('start_date')}>
                        Start Date {sortField === 'start_date' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                </tr>
            </thead>
            <tbody>
                {data.map((assignment, index) => (
                    <tr key={index}>
                        <td>{assignment.employee.employee_id}</td>
                        <td>{assignment.employee.full_name}</td>
                        <td>{assignment.project.project_name}</td>
                        <td>{new Date(assignment.start_date).toLocaleDateString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default AssignmentTable;