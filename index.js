const express = require('express');
const app = express();
const port = 4325;

app.use(express.json());

// Variables to store points and visits
let points = [];
let visits = [];

// Route to add a new point
app.post('/addPoint', (req, res) => {
    const { name, location } = req.body;
    const point = { id: points.length, name, location };
    points.push(point);
    res.status(200).json("Point added successfully");
});

// Route to edit a point by ID
app.put('/editPoint/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, location } = req.body;

    let point = points.find(p => p.id === id);
    if (!point) return res.status(404).json("Point not found");

    point.name = name || point.name;
    point.location = location || point.location;
    res.status(200).json("Point updated successfully");
});

// Route to delete a point by ID
app.delete('/deletePoint/:id', (req, res) => {
    const id = parseInt(req.params.id);
    points = points.filter(p => p.id !== id);
    res.status(200).json("Point deleted successfully");
});

// Route to display all points
app.get('/pointsList', (req, res) => {
    res.status(200).json(points);
});

// Route to add a visit at a point
app.post('/addVisit', (req, res) => {
    const { pointId } = req.body;
    const point = points.find(p => p.id === parseInt(pointId));

    if (!point) return res.status(404).json("Point not found");

    const visit = { id: visits.length, pointId: point.id, visitTime: new Date() };
    visits.push(visit);
    res.status(200).json("Visit recorded successfully");
});

// Route to display all visits
app.get('/visitsList', (req, res) => {
    const visitDetails = visits.map(visit => {
        const point = points.find(p => p.id === visit.pointId);
        return {
            id: visit.id,
            pointName: point ? point.name : "Unknown Point",
            visitTime: visit.visitTime
        };
    });
    res.status(200).json(visitDetails);
});

// Starting the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
