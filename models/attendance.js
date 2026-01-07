// Mock data pre účasti na tréningoch
export const mockAttendance = {
  1: {
    // Training ID 1
    confirmed: [4], // Peter Hráč
    notConfirmed: [5], // Mária Rodičová
  },
};

// Funkcie pre prácu s účasťami
export const getAttendanceByTraining = (trainingId) => {
  const attendance = mockAttendance[trainingId] || { confirmed: [], notConfirmed: [] };
  // Return a new object copy to ensure React detects changes
  return {
    confirmed: [...attendance.confirmed],
    notConfirmed: [...attendance.notConfirmed]
  };
};

export const confirmAttendance = (trainingId, userId) => {
  if (!mockAttendance[trainingId]) {
    mockAttendance[trainingId] = { confirmed: [], notConfirmed: [] };
  }
  
  // Odstrániť z notConfirmed ak tam je
  mockAttendance[trainingId].notConfirmed = mockAttendance[trainingId].notConfirmed.filter(
    (id) => id !== userId
  );
  
  // Pridať do confirmed ak tam ešte nie je
  if (!mockAttendance[trainingId].confirmed.includes(userId)) {
    mockAttendance[trainingId].confirmed.push(userId);
  }
};

export const unconfirmAttendance = (trainingId, userId) => {
  if (!mockAttendance[trainingId]) {
    mockAttendance[trainingId] = { confirmed: [], notConfirmed: [] };
  }
  
  // Odstrániť z confirmed ak tam je
  mockAttendance[trainingId].confirmed = mockAttendance[trainingId].confirmed.filter(
    (id) => id !== userId
  );
  
  // Pridať do notConfirmed ak tam ešte nie je
  if (!mockAttendance[trainingId].notConfirmed.includes(userId)) {
    mockAttendance[trainingId].notConfirmed.push(userId);
  }
};
