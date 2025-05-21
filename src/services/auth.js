// // src/services/auth.js
// export const login = async (email, password) => {
//   try {
//     // For demo purposes, we'll just validate the mock credentials
//     if (email === 'jane.doe@gmail.com' && password === 'janedoe@123') {
//       localStorage.setItem('userId', '1');
//       localStorage.setItem('userEmail', email);
//       return { userId: 1, email };
//     }
//     throw new Error('Invalid email or password');
//   } catch (error) {
//     console.error('Login failed:', error);
//     throw error;
//   }
// };

// export const logout = () => {
//   localStorage.removeItem('userId');
//   localStorage.removeItem('userEmail');
// };

// export const getAuthHeaders = () => {
//   return {
//     'Content-Type': 'application/json',
//     'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
//     'x-hasura-role': 'user',
//     'x-hasura-user-id': localStorage.getItem('userId') || '1'
//   };
// };

// export const isAuthenticated = () => {
//   return !!localStorage.getItem('userId');
// };

// src/services/auth.js
const USERS = [
  { id: 1, email: 'jane.doe@gmail.com', password: 'janedoe@123' },
  { id: 5, email: 'teja@gmail.com', password: 'teja@123' },
  // Add more users up to id 17
];

export const login = async (email, password) => {
  try {
    const user = USERS.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('userId', user.id.toString());
      localStorage.setItem('userEmail', user.email);
      return { userId: user.id, email: user.email };
    }
    throw new Error('Invalid email or password');
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
};

export const getAuthHeaders = () => {
  const userId = localStorage.getItem('userId') || '1';
  return {
    'Content-Type': 'application/json',
    'x-hasura-admin-secret': 'g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF',
    'x-hasura-role': 'user',
    'x-hasura-user-id': userId
  };
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('userId');
};

export const getCurrentUser = () => {
  return {
    id: localStorage.getItem('userId'),
    email: localStorage.getItem('userEmail')
  };
};