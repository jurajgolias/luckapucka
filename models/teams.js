// Mock data pre tímy
export const mockTeams = [
  {
    id: 1,
    name: "Futbal U16",
    sport: "Futbal",
    members: 2,
    trainerId: 2, // Ján Tréner
  },
  {
    id: 2,
    name: "Futbal U18",
    sport: "Futbal",
    members: 0,
    trainerId: 2,
  },
  {
    id: 3,
    name: "Basketbal Ženy",
    sport: "Basketbal",
    members: 0,
    trainerId: 2,
  },
];

// Funkcie pre prácu s tímami
export const getTeamById = (id) => {
  return mockTeams.find((t) => t.id === id) || null;
};

export const getTeamsByTrainer = (trainerId) => {
  return mockTeams.filter((t) => t.trainerId === trainerId);
};

export const getTeamsByIds = (ids = []) => {
  if (!Array.isArray(ids)) return [];
  return mockTeams.filter((t) => ids.includes(t.id));
};

// Funkcia na pridanie nového tímu
export const addTeam = ({ name, sport, members = 0, trainerId = 2 }) => {
  const nextId = mockTeams.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  const newTeam = {
    id: nextId,
    name,
    sport,
    members: Number(members) || 0,
    trainerId,
  };
  mockTeams.push(newTeam);
  return newTeam;
};

// Funkcia na úpravu existujúceho tímu
export const updateTeam = ({ id, name, sport, members, trainerId }) => {
  const index = mockTeams.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const existing = mockTeams[index];
  const updated = {
    ...existing,
    name: name ?? existing.name,
    sport: sport ?? existing.sport,
    members: members !== undefined ? Number(members) || 0 : existing.members,
    trainerId: trainerId ?? existing.trainerId,
  };

  mockTeams[index] = updated;
  return updated;
};

// Funkcia na odstránenie tímu podľa ID
export const deleteTeam = (id) => {
  const index = mockTeams.findIndex((t) => t.id === id);
  if (index === -1) return false;
  mockTeams.splice(index, 1);
  return true;
};
