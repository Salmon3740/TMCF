import { INITIAL_RECORDS, INITIAL_TARGET_GOAL } from '../data/initialData';

const STORAGE_KEY_RECORDS = 'tmcf_reconstruction_records_v1';
const STORAGE_KEY_GOAL = 'tmcf_reconstruction_goal_v1';
const STORAGE_KEY_FIREBASE = 'tmcf_firebase_config_v1';

export const getStoredRecords = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECORDS);
    if (!raw) {
      // First load: save default records
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(INITIAL_RECORDS));
      return INITIAL_RECORDS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_RECORDS;
  } catch (err) {
    console.error("Error reading stored records:", err);
    return INITIAL_RECORDS;
  }
};

export const saveRecords = (records) => {
  try {
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
    // Dispatch custom event so other components update if needed
    window.dispatchEvent(new Event('tmcf_records_updated'));
    return true;
  } catch (err) {
    console.error("Error saving records:", err);
    return false;
  }
};

export const addRecord = (newRecordData) => {
  const currentRecords = getStoredRecords();
  const newRecord = {
    id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    name: newRecordData.name.trim(),
    address: newRecordData.address.trim(),
    amount: parseFloat(newRecordData.amount) || 0,
    date: newRecordData.date || new Date().toISOString().split('T')[0],
    time: newRecordData.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    imageUrl: newRecordData.imageUrl || null,
    notes: newRecordData.notes ? newRecordData.notes.trim() : '',
    createdAt: new Date().toISOString()
  };

  const updatedRecords = [newRecord, ...currentRecords];
  saveRecords(updatedRecords);
  return newRecord;
};

export const updateRecord = (id, updatedData) => {
  const currentRecords = getStoredRecords();
  const updatedRecords = currentRecords.map(rec => {
    if (rec.id === id) {
      return {
        ...rec,
        name: updatedData.name.trim(),
        address: updatedData.address.trim(),
        amount: parseFloat(updatedData.amount) || 0,
        date: updatedData.date,
        time: updatedData.time,
        imageUrl: updatedData.imageUrl !== undefined ? updatedData.imageUrl : rec.imageUrl,
        notes: updatedData.notes !== undefined ? updatedData.notes.trim() : rec.notes,
        updatedAt: new Date().toISOString()
      };
    }
    return rec;
  });

  saveRecords(updatedRecords);
  return true;
};

export const deleteRecord = (id) => {
  const currentRecords = getStoredRecords();
  const updatedRecords = currentRecords.filter(rec => rec.id !== id);
  saveRecords(updatedRecords);
  return true;
};

export const getTargetGoal = () => {
  try {
    const goal = localStorage.getItem(STORAGE_KEY_GOAL);
    return goal ? parseFloat(goal) : INITIAL_TARGET_GOAL;
  } catch (err) {
    return INITIAL_TARGET_GOAL;
  }
};

export const saveTargetGoal = (newGoal) => {
  try {
    localStorage.setItem(STORAGE_KEY_GOAL, newGoal.toString());
    window.dispatchEvent(new Event('tmcf_goal_updated'));
    return true;
  } catch (err) {
    return false;
  }
};

export const resetRecordsToDefaults = () => {
  localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(INITIAL_RECORDS));
  localStorage.setItem(STORAGE_KEY_GOAL, INITIAL_TARGET_GOAL.toString());
  window.dispatchEvent(new Event('tmcf_records_updated'));
  return INITIAL_RECORDS;
};

// Export/Import Backup JSON functionality
export const exportBackupJSON = () => {
  const records = getStoredRecords();
  const goal = getTargetGoal();
  const backupData = {
    appName: "TMCF Church Reconstruction Fund Tracker",
    exportedAt: new Date().toISOString(),
    targetGoal: goal,
    recordsCount: records.length,
    records: records
  };
  return JSON.stringify(backupData, null, 2);
};

export const importBackupJSON = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    if (Array.isArray(data.records)) {
      saveRecords(data.records);
      if (data.targetGoal) {
        saveTargetGoal(data.targetGoal);
      }
      return { success: true, count: data.records.length };
    }
    return { success: false, message: "Invalid JSON format: missing records array." };
  } catch (err) {
    return { success: false, message: "Could not parse JSON file: " + err.message };
  }
};
