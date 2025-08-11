const tableBody = document.querySelector('#studentsTable tbody');
const form = document.getElementById('studentForm');
const nameInput = document.getElementById('name');
const gradeSelect = document.getElementById('grade');
const contactInput = document.getElementById('contact');
const studentIdInput = document.getElementById('studentId');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');

const searchNameInput = document.getElementById('searchName');
const filterGradeSelect = document.getElementById('filterGrade');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');

let students = [];

// Fetch and display students with filters applied
async function fetchStudents() {
  const name = searchNameInput.value.trim();
  const grade = filterGradeSelect.value;

  let url = '/students?';
  if (name) url += `name=${encodeURIComponent(name)}&`;
  if (grade) url += `grade=${encodeURIComponent(grade)}&`;

  const res = await fetch(url);
  students = await res.json();
  renderTable();
}

function renderTable() {
  tableBody.innerHTML = '';

  if (students.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="4" style="text-align:center; color:#999;">No students found</td>`;
    tableBody.appendChild(tr);
    return;
  }

  students.forEach((student) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${student.name}</td>
      <td>${student.grade}</td>
      <td>${student.contact || ''}</td>
      <td>
        <button class="action-btn edit" onclick="editStudent(${student.id})">Edit</button>
        <button class="action-btn delete" onclick="deleteStudent(${student.id})">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// Add or update student
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = studentIdInput.value;
  const name = nameInput.value.trim();
  const grade = gradeSelect.value;
  const contact = contactInput.value.trim();

  if (!name || !grade) {
    alert('Name and grade are required');
    return;
  }

  if (id) {
    // Update existing
    await fetch(`/students/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, grade, contact }),
    });
    resetForm();
  } else {
    // Add new
    await fetch('/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, grade, contact }),
    });
  }

  fetchStudents();
  form.reset();
});

// Edit student (fill form with data)
function editStudent(id) {
  const student = students.find((s) => s.id === id);
  if (!student) return;

  studentIdInput.value = student.id;
  nameInput.value = student.name;
  gradeSelect.value = student.grade;
  contactInput.value = student.contact || '';

  submitBtn.textContent = 'Update Student';
  cancelBtn.classList.remove('hidden');
}

// Cancel edit and reset form
cancelBtn.addEventListener('click', () => {
  resetForm();
});

function resetForm() {
  studentIdInput.value = '';
  form.reset();
  submitBtn.textContent = 'Add Student';
  cancelBtn.classList.add('hidden');
}

// Delete student
async function deleteStudent(id) {
  if (!confirm('Are you sure you want to delete this student?')) return;

  await fetch(`/students/${id}`, { method: 'DELETE' });
  fetchStudents();
}

// Search & Filter event listeners
searchNameInput.addEventListener('input', () => {
  fetchStudents();
});

filterGradeSelect.addEventListener('change', () => {
  fetchStudents();
});

clearFiltersBtn.addEventListener('click', () => {
  searchNameInput.value = '';
  filterGradeSelect.value = '';
  fetchStudents();
});

// Initial load
fetchStudents();
