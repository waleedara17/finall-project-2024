const apiBaseUrl = 'http://localhost:4325';

// Load points and visits on page load
document.addEventListener("DOMContentLoaded", async () => {
    await loadPoints();
    await loadVisits();
});

// Load all points
async function loadPoints() {
    try {
        const res = await fetch(`${apiBaseUrl}/pointsList`);
        const points = await res.json();
        const pointsList = document.getElementById('pointsList');
        const pointSelect = document.getElementById('pointSelect');

        pointsList.innerHTML = '';
        pointSelect.innerHTML = '';

        points.forEach(point => {
            // Populate points list
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${point.name}</strong> (${point.location})
                <button onclick="deletePoint(${point.id})">מחק</button>
                <button onclick="editPoint(${point.id}, '${point.name}', '${point.location}')">ערוך</button>
            `;
            pointsList.appendChild(li);

            // Populate select dropdown for visits
            const option = document.createElement('option');
            option.value = point.id;
            option.textContent = point.name;
            pointSelect.appendChild(option);
        });
    } catch (err) {
        console.error("שגיאה בטעינת הנקודות", err);
    }
}

// Add new point
document.getElementById("addPointForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = document.getElementById("pointName").value;
    const location = document.getElementById("pointLocation").value;

    try {
        await fetch(`${apiBaseUrl}/addPoint`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, location })
        });
        loadPoints();
    } catch (err) {
        console.error("שגיאה בהוספת נקודה", err);
    }
});

// Delete point
async function deletePoint(id) {
    try {
        await fetch(`${apiBaseUrl}/deletePoint/${id}`, { method: 'DELETE' });
        loadPoints();
    } catch (err) {
        console.error("שגיאה במחיקת נקודה", err);
    }
}

// Edit point
function editPoint(id, name, location) {
    const newName = prompt("הכנס שם חדש", name);
    const newLocation = prompt("הכנס מיקום חדש", location);

    if (newName && newLocation) {
        fetch(`${apiBaseUrl}/editPoint/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName, location: newLocation })
        })
        .then(loadPoints)
        .catch(err => console.error("שגיאה בעריכת נקודה", err));
    }
}

// Record a visit at a point
document.getElementById("visitForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const pointId = document.getElementById("pointSelect").value;

    try {
        await fetch(`${apiBaseUrl}/addVisit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pointId })
        });
        loadVisits();
    } catch (err) {
        console.error("שגיאה ברישום ביקור", err);
    }
});

// Load all visits
async function loadVisits() {
    try {
        const res = await fetch(`${apiBaseUrl}/visitsList`);
        const visits = await res.json();
        const visitsList = document.getElementById('visitsList');
        visitsList.innerHTML = '';

        visits.forEach(visit => {
            const li = document.createElement('li');
            li.textContent = `${visit.pointName} - ${new Date(visit.visitTime).toLocaleString()}`;
            visitsList.appendChild(li);
        });
    } catch (err) {
        console.error("שגיאה בטעינת הביקורים", err);
    }
}
