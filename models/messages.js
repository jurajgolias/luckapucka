// Mock data pre chatrooms (konverzácie)
export const mockChatrooms = [
  {
    id: 1,
    type: "private", // private alebo group
    participants: [1, 2], // Admin a Ján Tréner
    createdAt: "2025-10-15T10:00:00",
  },
  {
    id: 2,
    type: "private",
    participants: [4, 2], // Peter Hráč a Ján Tréner
    createdAt: "2025-10-16T14:30:00",
  },
  {
    id: 3,
    type: "group",
    name: "Futbal U16",
    teamId: 1,
    participants: [2, 4, 5], // Tréner, Peter, Mária
    createdAt: "2025-10-10T09:00:00",
  },
];

export const mockMessages = {
  1: [
    {
      id: 1,
      senderId: 2,
      text: "Ahoj! Ako sa máš?",
      timestamp: "2025-10-15T10:30:00",
    },
    {
      id: 2,
      senderId: 1,
      text: "Dobrý deň, výborne ďakujem!",
      timestamp: "2025-10-15T10:35:00",
    },
  ],
  2: [
    {
      id: 1,
      senderId: 4,
      text: "Môžem prísť na tréning neskôr?",
      timestamp: "2025-10-16T14:35:00",
    },
    {
      id: 2,
      senderId: 2,
      text: "Áno, žiadny problém!",
      timestamp: "2025-10-16T14:40:00",
    },
  ],
  3: [
    {
      id: 1,
      senderId: 2,
      text: "Ahoj všetci! V stredu bude tréning o 17:00.",
      timestamp: "2025-10-17T10:30:00",
    },
    {
      id: 2,
      senderId: 4,
      text: "Prídem, ďakujem!",
      timestamp: "2025-10-17T10:35:00",
    },
    {
      id: 3,
      senderId: 5,
      text: "Aj ja budem!",
      timestamp: "2025-10-17T11:00:00",
    },
  ],
};

// Funkcie pre prácu s chatroomami
export const getChatroomById = (id) => {
  return mockChatrooms.find((c) => c.id === id) || null;
};

export const getChatroomsByUserId = (userId) => {
  return mockChatrooms.filter((c) => c.participants.includes(userId));
};

export const getMessagesByChatroomId = (chatroomId) => {
  return mockMessages[chatroomId] || [];
};

export const addMessage = (chatroomId, senderId, text) => {
  if (!mockMessages[chatroomId]) {
    mockMessages[chatroomId] = [];
  }
  const newMessage = {
    id: mockMessages[chatroomId].length + 1,
    senderId,
    text,
    timestamp: new Date().toISOString(),
  };
  mockMessages[chatroomId].push(newMessage);
  return newMessage;
};

// Vytvorenie novej private konverzácie medzi dvoma používateľmi
export const createPrivateChatroom = (userId1, userId2) => {
  // Skontrolovať či už konverzácia existuje
  const existing = mockChatrooms.find(
    (c) =>
      c.type === "private" &&
      c.participants.includes(userId1) &&
      c.participants.includes(userId2)
  );
  
  if (existing) {
    return existing;
  }

  const newChatroom = {
    id: mockChatrooms.length + 1,
    type: "private",
    participants: [userId1, userId2],
    createdAt: new Date().toISOString(),
  };
  mockChatrooms.push(newChatroom);
  return newChatroom;
};

// Vytvorenie skupinového chatu
export const createGroupChatroom = (name, participants) => {
  const newChatroom = {
    id: mockChatrooms.length + 1,
    type: "group",
    name,
    participants,
    createdAt: new Date().toISOString(),
  };
  mockChatrooms.push(newChatroom);
  return newChatroom;
};

// Vytvorenie skupinového chatu pre tím (ak už existuje, vráti existujúci)
export const createTeamChatroom = (teamId, name, participants) => {
  const existing = mockChatrooms.find(
    (c) => c.type === "group" && c.teamId === teamId
  );
  if (existing) return existing;

  const newChatroom = {
    id: mockChatrooms.length + 1,
    type: "group",
    name,
    teamId,
    participants,
    createdAt: new Date().toISOString(),
  };
  mockChatrooms.push(newChatroom);
  return newChatroom;
};
