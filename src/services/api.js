// src/services/api.js
import axios from 'axios';
import { getAuthHeaders } from './auth';

const API_BASE_URL = 'https://bursting-gelding-24.hasura.app/api/rest';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL
});

// Helper function to make authenticated requests
const authRequest = async (method, url, data = null) => {
  const config = {
    method,
    url,
    headers: getAuthHeaders()
  };

  // For GET requests, 'data' should typically be passed as 'params' for query string
  // For POST/PUT/PATCH, 'data' goes in the body
  if (method === 'get' && data) {
    config.params = data; // Pass data as query parameters
  } else if (data) {
    config.data = data; // Pass data as request body for other methods
  }

  try {
    const response = await api(config);
    return response.data;
  } catch (error) {
    console.error(`API Error (${method} ${url}):`, error);
    throw error;
  }
};

// Fetch all transactions with pagination
export const getAllTransactions = async (limit = 10000, offset = 0) => {
  // Now, authRequest will correctly put limit and offset into URL query params
  const data = await authRequest('get', '/all-transactions', { limit, offset });
  return data.transactions;
};


// Fetch credit and debit totals
export const getCreditDebitTotals = async () => {
  const data = await authRequest('get', '/credit-debit-totals');
  return data.totals_credit_debit_transactions;
};

// Fetch daywise totals for the last 7 days
export const getLast7DaysTotals = async () => {
  const data = await authRequest('get', '/daywise-totals-7-days');
  return data.last_7_days_transactions_credit_debit_totals;
};

// Add a new transaction
export const addTransaction = async (transaction) => {
  const data = await authRequest('post', '/add-transaction', {
    name: transaction.transaction_name,
    type: transaction.type,
    category: transaction.category,
    amount: transaction.amount,
    date: transaction.date,
    user_id: parseInt(localStorage.getItem('userId') || '1')
  });
  return data.insert_transactions_one;
};

// Update an existing transaction
export const updateTransaction = async (transaction) => {
  const data = await authRequest('put', '/update-transaction', {
    id: transaction.id,
    name: transaction.transaction_name,
    type: transaction.type,
    category: transaction.category,
    amount: transaction.amount,
    date: transaction.date
  });
  return data.update_transactions_by_pk;
};

// Delete a transaction
export const deleteTransaction = async (id) => {
  const data = await authRequest('delete', '/delete-transaction', { id });
  return data.delete_transactions_by_pk;
};

// Fetch user profile
export const getProfile = async () => {
  const data = await authRequest('get', '/profile');
  return data.users[0];
};

// Get user ID (mocked for demo purposes)
export const getUserId = async (email, password) => {
  if (email === 'jane.doe@gmail.com' && password === 'janedoe@123') {
    return 1;
  }
  return null;
};
