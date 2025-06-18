const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveSubject: (subject) => ipcRenderer.invoke('save-subject', subject),
  getSubjects: () => ipcRenderer.invoke('get-subjects'),
  deleteSubject: (id) => ipcRenderer.invoke('delete-subject', id),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  openFolder: (path) => ipcRenderer.invoke('open-folder', path), // New method
});