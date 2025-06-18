const subjectInput = document.getElementById('subjectInput');
const selectFolderBtn = document.getElementById('selectFolderBtn');
const selectedPath = document.getElementById('selectedPath');
const createBtn = document.getElementById('createBtn');
const updateBtn = document.getElementById('updateBtn');
const deleteBtn = document.getElementById('deleteBtn');
const folderList = document.getElementById('folderList');
const message = document.getElementById('message');
const themeToggle = document.getElementById('themeToggle');

let selectedFolder = '';
let editingSubject = null;

// Debugging: Verify DOM elements
console.log('subjectInput:', subjectInput);
console.log('selectedPath:', selectedPath);

// Message feedback
function showMessage(text, type = 'info') {
  message.textContent = text;
  message.className = `message ${type === 'error' ? 'error' : 'success'}`;
  setTimeout(() => { message.textContent = ''; message.className = 'message'; }, 3000);
}

// Load subjects
async function loadSubjects() {
  try {
    const subjects = await window.electronAPI.getSubjects();
    folderList.innerHTML = '';
    subjects.forEach(subject => {
      const li = document.createElement('li');
      li.className = 'folder-item';
      li.innerHTML = `<span>${subject.name}</span><span>${subject.path}</span>`;
      li.addEventListener('click', async () => {
        // Debugging: Log subject details
        console.log('Clicked subject:', subject);

        // Ensure elements exist
        if (!subjectInput || !selectedPath) {
          showMessage('Error: Input or path element not found', 'error');
          return;
        }

        // Update UI
        subjectInput.value = subject.name;
        selectedFolder = subject.path;
        selectedPath.textContent = `Selected: ${selectedFolder}`;
        editingSubject = subject;

        // Force UI update
        requestAnimationFrame(() => {
          subjectInput.value = subject.name;
          selectedPath.textContent = `Selected: ${selectedFolder}`;
        });

        // Open the folder in file explorer
        const success = await window.electronAPI.openFolder(subject.path);
        if (success) {
          showMessage('Folder opened successfully', 'info');
        } else {
          showMessage('Failed to open folder', 'error');
        }

        // Debugging: Verify updates
        console.log('subjectInput.value:', subjectInput.value);
        console.log('selectedPath.textContent:', selectedPath.textContent);

        showMessage('Subject loaded for editing', 'info');
      });
      folderList.appendChild(li);
    });
  } catch (error) {
    showMessage('Error loading subjects', 'error');
  }
}

// Select folder
selectFolderBtn.addEventListener('click', async () => {
  const folder = await window.electronAPI.selectFolder();
  if (folder) {
    selectedFolder = folder;
    selectedPath.textContent = `Selected: ${selectedFolder}`;
  }
});

// Create subject
createBtn.addEventListener('click', async () => {
  if (!subjectInput.value || !selectedFolder) {
    showMessage('Please enter a subject name and select a folder', 'error');
    return;
  }
  try {
    const subject = {
      id: editingSubject ? editingSubject.id : new Date().getTime(),
      name: subjectInput.value,
      path: selectedFolder,
    };
    await window.electronAPI.saveSubject(subject);
    showMessage('Subject saved successfully', 'info');
    resetForm();
    loadSubjects();
  } catch (error) {
    showMessage('Error saving subject', 'error');
  }
});

// Update subject
updateBtn.addEventListener('click', async () => {
  if (!editingSubject) {
    showMessage('Select a subject to update', 'error');
    return;
  }
  if (!subjectInput.value || !selectedFolder) {
    showMessage('Please enter a subject name and select a folder', 'error');
    return;
  }
  try {
    const subject = {
      id: editingSubject.id,
      name: subjectInput.value,
      path: selectedFolder,
    };
    await window.electronAPI.saveSubject(subject);
    showMessage('Subject updated successfully', 'info');
    resetForm();
    loadSubjects();
  } catch (error) {
    showMessage('Error updating subject', 'error');
  }
});

// Delete subject
deleteBtn.addEventListener('click', async () => {
  if (!editingSubject) {
    showMessage('Select a subject to delete', 'error');
    return;
  }
  try {
    await window.electronAPI.deleteSubject(editingSubject.id);
    showMessage('Subject deleted successfully', 'info');
    resetForm();
    loadSubjects();
  } catch (error) {
    showMessage('Error deleting subject', 'error');
  }
});

// Reset form
function resetForm() {
  subjectInput.value = '';
  selectedFolder = '';
  selectedPath.textContent = '';
  editingSubject = null;
}

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.innerHTML = document.body.classList.contains('dark') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// Initial load
loadSubjects();