// Student Management System with localStorage
// File: script.js

let students = [];
let editingIndex = -1;
const STORAGE_KEY = 'students';

// localStorage functions
function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function loadFromStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Render table
function renderTable() {
    const tableBody = document.getElementById('studentTableBody');
    const noRecords = document.getElementById('noRecords');

    if (students.length === 0) {
        tableBody.innerHTML = '';
        noRecords.classList.remove('hidden');
        return;
    }

    noRecords.classList.add('hidden');
    tableBody.innerHTML = students.map((student, index) => `
        <tr class="border-b hover:bg-gray-50">
            <td class="p-3 text-gray-800">${student.name}</td>
            <td class="p-3 text-gray-600 font-mono">${student.id}</td>
            <td class="p-3 text-gray-600">${student.email}</td>
            <td class="p-3 text-gray-600">${student.contact}</td>
            <td class="p-3 text-center">
                <button onclick="editStudent(${index})" class="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition duration-200 mr-2">Edit</button>
                <button onclick="deleteStudent(${index})" class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition duration-200">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Add student
function addStudent(studentData) {
    // Check if student ID already exists
    if (students.some(student => student.id === studentData.id)) {
        alert('Student ID already exists!');
        return false;
    }

    students.push(studentData);
    saveToStorage();
    renderTable();
    showSuccess('Student added successfully!');
    return true;
}

// Edit student
function editStudent(index) {
    editingIndex = index;
    const student = students[index];

    document.getElementById('editName').value = student.name;
    document.getElementById('editId').value = student.id;
    document.getElementById('editEmail').value = student.email;
    document.getElementById('editContact').value = student.contact;

    document.getElementById('editModal').classList.remove('hidden');
}

// Update student
function updateStudent(updatedData) {
    // Check for duplicate ID (excluding current student)
    if (students.some((student, index) => student.id === updatedData.id && index !== editingIndex)) {
        alert('Student ID already exists!');
        return false;
    }

    students[editingIndex] = updatedData;
    saveToStorage();
    renderTable();
    showSuccess('Student updated successfully!');
    return true;
}

// Delete student
function deleteStudent(index) {
    if (confirm('Are you sure you want to delete this student?')) {
        students.splice(index, 1);
        saveToStorage();
        renderTable();
        showSuccess('Student deleted successfully!');
    }
}

// Close modal
function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
    editingIndex = -1;
}

// Show success message
function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.querySelector('p:last-child').textContent = message;
    successDiv.classList.remove('hidden');

    setTimeout(() => {
        successDiv.classList.add('hidden');
    }, 3000);
}

// Format phone input
function formatPhone(input) {
    input.addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value.length > 10) {
            this.value = this.value.substring(0, 10);
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    // Load existing data
    students = loadFromStorage();
    renderTable();

    // Add form handler
    document.getElementById('studentForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const studentData = {
            name: formData.get('studentName').trim(),
            id: formData.get('studentId').trim(),
            email: formData.get('email').trim(),
            contact: formData.get('contactNo').trim()
        };

        // Basic validation
        if (!studentData.name || !studentData.id || !studentData.email || !studentData.contact) {
            alert('Please fill all fields');
            return;
        }

        if (studentData.contact.length !== 10) {
            alert('Contact number must be 10 digits');
            return;
        }

        if (addStudent(studentData)) {
            this.reset();
        }
    });

    // Edit form handler
    document.getElementById('editForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const updatedData = {
            name: document.getElementById('editName').value.trim(),
            id: document.getElementById('editId').value.trim(),
            email: document.getElementById('editEmail').value.trim(),
            contact: document.getElementById('editContact').value.trim()
        };

        if (updateStudent(updatedData)) {
            closeEditModal();
        }
    });

    // Phone formatting
    formatPhone(document.getElementById('contactNo'));
    formatPhone(document.getElementById('editContact'));
});

// Global functions
window.editStudent = editStudent;
window.deleteStudent = deleteStudent;
window.closeEditModal = closeEditModal;