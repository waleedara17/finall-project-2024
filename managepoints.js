const apiBaseUrl = 'http://localhost:4325';

// Load points on page load
document.addEventListener("DOMContentLoaded", loadPoints);

async function loadPoints() {
    try {
        const res = await fetch(`${apiBaseUrl}/pointsList`);
        const points = await res.json();
        const pointsList = document.getElementById('pointsList');
        pointsList.innerHTML = '';

        points.forEach(point => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${point.name}</strong> (${point.location})
                <button onclick="deletePoint(${point.id})">מחק</button>
                <button onclick="editPoint(${point.id}, '${point.name}', '${point.location}')">ערוך</button>
            `;
            pointsList.appendChild(li);
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
