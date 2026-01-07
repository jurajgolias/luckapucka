// Mock data pre používateľov
export const mockUsers = [
  {
    id: 1,
    email: "admin@ta.sk",
    password: "admin123",
    firstName: "Admin",
    lastName: "Hlavný",
    age: 45,
    role: "admin",
    teams: 0,
  },
  {
    id: 2,
    email: "trener@ta.sk",
    password: "trener123",
    firstName: "Ján",
    lastName: "Tréner",
    age: 35,
    role: "trainer",
    teams: 2,
  },
  {
    id: 3,
    email: "manazer@ta.sk",
    password: "manazer123",
    firstName: "Eva",
    lastName: "Manažérová",
    age: 38,
    role: "manager",
    teams: 3,
  },
  {
    id: 4,
    email: "hrac@ta.sk",
    password: "hrac123",
    firstName: "Peter",
    lastName: "Hráč",
    age: 18,
    role: "player",
    teams: 1,
    teamIds: [1], // Futbal U16
  },
  {
    id: 5,
    email: "rodic@ta.sk",
    password: "rodic123",
    firstName: "Mária",
    lastName: "Rodičová",
    age: 42,
    role: "player",
    teams: 1,
    teamIds: [1], // Futbal U16
  },
];

// Funkcia na overenie prihlasovacích údajov
export const authenticateUser = (email, password) => {
  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );
  return user || null;
};

// Funkcia na získanie používateľa podľa emailu
export const getUserByEmail = (email) => {
  return mockUsers.find((u) => u.email === email) || null;
};

// Funkcia na pridanie nového manažéra (lokálne mock dáta)
export const addManager = ({ firstName, lastName, email, age, password = "manazer123", teams = 0 }) => {
  const nextId = mockUsers.reduce((max, u) => Math.max(max, u.id), 0) + 1;
  const newManager = {
    id: nextId,
    email,
    password,
    firstName,
    lastName,
    age: Number(age) || 0,
    role: "manager",
    teams,
  };

  mockUsers.push(newManager);
  return newManager;
};

// Funkcia na úpravu existujúceho manažéra
export const updateManager = ({ id, firstName, lastName, email, age, password, teams }) => {
  const index = mockUsers.findIndex((u) => u.id === id);
  if (index === -1) return null;

  const existing = mockUsers[index];
  const updated = {
    ...existing,
    firstName: firstName ?? existing.firstName,
    lastName: lastName ?? existing.lastName,
    email: email ?? existing.email,
    password: password || existing.password,
    age: age !== undefined ? Number(age) || 0 : existing.age,
    teams: teams ?? existing.teams,
  };

  mockUsers[index] = updated;
  return updated;
};

// Funkcia na odstránenie manažéra podľa ID
export const deleteManager = (id) => {
  const index = mockUsers.findIndex((u) => u.id === id);
  if (index === -1) return false;
  mockUsers.splice(index, 1);
  return true;
};

// Funkcia na pridanie nového používateľa (pre manažéra)
export const addUser = ({ firstName, lastName, email, age, password = "user123", role = "player", teams = 0 }) => {
  const nextId = mockUsers.reduce((max, u) => Math.max(max, u.id), 0) + 1;
  const newUser = {
    id: nextId,
    email,
    password,
    firstName,
    lastName,
    age: Number(age) || 0,
    role,
    teams,
    teamIds: [], // Prázdne pole tímov pre nových používateľov
  };

  mockUsers.push(newUser);
  return newUser;
};

// Funkcia na úpravu existujúceho používateľa
export const updateExistingUser = ({ id, firstName, lastName, email, age, password, role, teams }) => {
  const index = mockUsers.findIndex((u) => u.id === id);
  if (index === -1) return null;

  const existing = mockUsers[index];
  const updated = {
    ...existing,
    firstName: firstName ?? existing.firstName,
    lastName: lastName ?? existing.lastName,
    email: email ?? existing.email,
    password: password || existing.password,
    age: age !== undefined ? Number(age) || 0 : existing.age,
    role: role ?? existing.role,
    teams: teams ?? existing.teams,
  };

  mockUsers[index] = updated;
  return updated;
};

// Funkcia na odstránenie používateľa podľa ID
export const deleteUser = (id) => {
  const index = mockUsers.findIndex((u) => u.id === id);
  if (index === -1) return false;
  mockUsers.splice(index, 1);
  return true;
};

// Pridať hráča do tímu (pridá teamId do zoznamu tímov hráča)
export const addPlayerToTeam = (teamId, playerId) => {
  const player = mockUsers.find((u) => u.id === playerId && u.role === "player");
  if (!player) return null;

  const currentTeams = player.teamIds || [];
  if (!currentTeams.includes(teamId)) {
    player.teamIds = [...currentTeams, teamId];
    if (typeof player.teams === "number") {
      player.teams = player.teams + 1;
    }
  }
  return player;
};

// Funkcia na získanie hráčov z konkrétneho tímu
export const getPlayersByTeamId = (teamId) => {
  return mockUsers.filter((u) => u.role === "player" && u.teamIds?.includes(teamId));
};
