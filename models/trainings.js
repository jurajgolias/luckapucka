// Mock data pre tréningy
export const mockTrainings = [
  {
    id: 1,
    teamId: 1,
    teamName: "Futbal U16",
    date: "2025-10-20",
    time: "17:00",
    location: "Hlavné ihrisko",
    description: "Tréning techniky a kondície. Zamerajte sa na sprinty a prihrávky.",
    recurrence: "weekly",
    trainerId: 2,
    confirmed: 1,
    notConfirmed: 1,
  },
  {
    id: 2,
    teamId: 2,
    teamName: "Futbal U18",
    date: "2025-10-21",
    time: "16:00",
    location: "Hlavné ihrisko",
    description: "Kondičný tréning.",
    recurrence: "weekly",
    trainerId: 2,
    confirmed: 0,
    notConfirmed: 0,
  },
  {
    id: 3,
    teamId: 1,
    teamName: "Futbal U16",
    date: "2025-10-22",
    time: "18:00",
    location: "Hlavné ihrisko",
    description: "Tréning techniky.",
    recurrence: "weekly",
    trainerId: 2,
    confirmed: 0,
    notConfirmed: 0,
  },
];

// Funkcie pre prácu s tréningmi
export const getTrainingById = (id) => {
  return mockTrainings.find((t) => t.id === id) || null;
};

export const getTrainingsByTeam = (teamId) => {
  return mockTrainings.filter((t) => t.teamId === teamId);
};

export const getTrainingsByTrainer = (trainerId) => {
  return mockTrainings.filter((t) => t.trainerId === trainerId);
};

export const addTraining = (training) => {
  const nextId = mockTrainings.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  const newTraining = {
    ...training,
    id: nextId,
    confirmed: 0,
    notConfirmed: 0,
  };
  mockTrainings.push(newTraining);
  return newTraining;
};

export const updateTraining = (id, updates) => {
  const index = mockTrainings.findIndex((t) => t.id === id);
  if (index !== -1) {
    mockTrainings[index] = { ...mockTrainings[index], ...updates };
    return mockTrainings[index];
  }
  return null;
};

export const deleteTraining = (id) => {
  const index = mockTrainings.findIndex((t) => t.id === id);
  if (index !== -1) {
    mockTrainings.splice(index, 1);
    return true;
  }
  return false;
};
