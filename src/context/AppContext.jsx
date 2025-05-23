import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAllTransactions, 
  getCreditDebitTotals, 
  getLast7DaysTotals,
  getProfile
} from '../services/api';
import { isAuthenticated } from '../services/auth';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({ credit: 0, debit: 0 });
  const [last7Days, setLast7Days] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
  if (!isAuthenticated()) return;
  
  try {
    setLoading(true);
    
    const [transactionsData, totalsData, last7DaysData, profileData] = await Promise.all([
      getAllTransactions(),
      getCreditDebitTotals(),
      getLast7DaysTotals(),
      getProfile()
    ]);

    // Transactions are already sorted by API, but double-check
    const sortedTransactions = transactionsData.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    setTransactions(sortedTransactions);
      
      const creditTotal = totalsData.find(t => t.type === 'credit')?.sum || 0;
      const debitTotal = totalsData.find(t => t.type === 'debit')?.sum || 0;
      setTotals({ credit: creditTotal, debit: debitTotal });
      
      setLast7Days(last7DaysData);
      setProfile(profileData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshTransactions = async () => {
    try {
      const [transactionsData, totalsData, last7DaysData] = await Promise.all([
        getAllTransactions(),
        getCreditDebitTotals(),
        getLast7DaysTotals()
      ]);
      
      setTransactions(transactionsData);
      const creditTotal = totalsData.find(t => t.type === 'credit')?.sum || 0;
      const debitTotal = totalsData.find(t => t.type === 'debit')?.sum || 0;
      setTotals({ credit: creditTotal, debit: debitTotal });
      setLast7Days(last7DaysData);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh data. Please try again.');
    }
  };


  return (
    <AppContext.Provider value={{
      transactions,
      totals,
      last7Days,
      profile,
      loading,
      error,
      fetchData,
      refreshTransactions
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);