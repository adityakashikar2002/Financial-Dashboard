// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAllTransactions, 
  getCreditDebitTotals, 
  getLast7DaysTotals,
  getProfile
} from '../services/api';
import { isAuthenticated } from '../services/auth';
import { deleteTransaction as deleteTransactionApi } from '../services/api';

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
      const transactionsData = await getAllTransactions();
      setTransactions(transactionsData);
    } catch (err) {
      console.error('Error refreshing transactions:', err);
      setError('Failed to refresh transactions. Please try again.');
    }
  };

  // Optimistic update for delete
  const deleteTransaction = async (id) => {
    try {
      // Optimistic update - remove from UI first
      setTransactions(prev => prev.filter(tx => tx.id !== id));
      
      // Update totals optimistically
      const transactionToDelete = transactions.find(tx => tx.id === id);
      if (transactionToDelete) {
        setTotals(prev => ({
          credit: transactionToDelete.type === 'credit' 
            ? prev.credit - transactionToDelete.amount 
            : prev.credit,
          debit: transactionToDelete.type === 'debit' 
            ? prev.debit - transactionToDelete.amount 
            : prev.debit
        }));
      }
      
      // Make API call
      await deleteTransactionApi(id);
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Failed to delete transaction. Please try again.');
      fetchData(); // Fallback to full refresh if error occurs
    }
  };

  // Optimistic update for add/update
  const updateTransactionList = (updatedTransaction, isNew = false) => {
    setTransactions(prev => {
      if (isNew) {
        return [updatedTransaction, ...prev].sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
      } else {
        return prev.map(tx => 
          tx.id === updatedTransaction.id ? updatedTransaction : tx
        );
      }
    });

    // Update totals
    if (isNew || updatedTransaction.type === 'credit') {
      setTotals(prev => ({
        credit: isNew 
          ? prev.credit + updatedTransaction.amount 
          : prev.credit,
        debit: prev.debit
      }));
    } else {
      setTotals(prev => ({
        credit: prev.credit,
        debit: isNew 
          ? prev.debit + updatedTransaction.amount 
          : prev.debit
      }));
    }
  };

  // return (
  //   <AppContext.Provider value={{
  //     transactions,
  //     totals,
  //     last7Days,
  //     profile,
  //     loading,
  //     error,
  //     fetchData,
  //     refreshTransactions,
  //     deleteTransaction,
  //     updateTransactionList
  //   }}>
  //     {children}
  //   </AppContext.Provider>
  // );
  return (
    <AppContext.Provider value={{
      transactions,
      setTransactions, // Add this line
      totals,
      setTotals, // Add this line
      last7Days,
      profile,
      loading,
      error,
      fetchData,
      refreshTransactions,
      updateTransactionList
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);


// // src/context/AppContext.jsx
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { 
//   getAllTransactions, 
//   getCreditDebitTotals, 
//   getLast7DaysTotals,
//   getProfile,
//   getAdminCreditDebitTotals,
//   getAdminLast7DaysTotals
// } from '../services/api';
// import { isAuthenticated, isAdmin } from '../services/auth';
// import { deleteTransaction as deleteTransactionApi } from '../services/api';

// const AppContext = createContext();

// export const AppProvider = ({ children }) => {
//   const [transactions, setTransactions] = useState([]);
//   const [totals, setTotals] = useState({ credit: 0, debit: 0 });
//   const [last7Days, setLast7Days] = useState([]);
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchData = async () => {
//     if (!isAuthenticated()) return;
    
//     try {
//       setLoading(true);
      
//       let totalsData, last7DaysData;
      
//       if (isAdmin()) {
//         // Use admin-specific APIs
//         [totalsData, last7DaysData] = await Promise.all([
//           getAdminCreditDebitTotals(),
//           getAdminLast7DaysTotals()
//         ]);
//       } else {
//         // Use regular user APIs
//         [totalsData, last7DaysData] = await Promise.all([
//           getCreditDebitTotals(),
//           getLast7DaysTotals()
//         ]);
//       }

//       const transactionsData = await getAllTransactions();
//       const profileData = await getProfile();

//       const sortedTransactions = transactionsData.sort((a, b) => 
//         new Date(b.date) - new Date(a.date)
//       );
      
//       setTransactions(sortedTransactions);
      
//       // Handle different response format for admin
//       const creditTotal = isAdmin() 
//         ? totalsData.find(t => t.type === 'credit')?.sum || 0
//         : totalsData.find(t => t.type === 'credit')?.sum || 0;
        
//       const debitTotal = isAdmin()
//         ? totalsData.find(t => t.type === 'debit')?.sum || 0
//         : totalsData.find(t => t.type === 'debit')?.sum || 0;
      
//       setTotals({ credit: creditTotal, debit: debitTotal });
//       setLast7Days(last7DaysData);
//       setProfile(profileData);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setError('Failed to fetch data. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const refreshTransactions = async () => {
//     try {
//       const transactionsData = await getAllTransactions();
//       setTransactions(transactionsData);
//     } catch (err) {
//       console.error('Error refreshing transactions:', err);
//       setError('Failed to refresh transactions. Please try again.');
//     }
//   };

//   // Optimistic update for delete
//   const deleteTransaction = async (id) => {
//     try {
//       // Optimistic update - remove from UI first
//       setTransactions(prev => prev.filter(tx => tx.id !== id));
      
//       // Update totals optimistically
//       const transactionToDelete = transactions.find(tx => tx.id === id);
//       if (transactionToDelete) {
//         setTotals(prev => ({
//           credit: transactionToDelete.type === 'credit' 
//             ? prev.credit - transactionToDelete.amount 
//             : prev.credit,
//           debit: transactionToDelete.type === 'debit' 
//             ? prev.debit - transactionToDelete.amount 
//             : prev.debit
//         }));
//       }
      
//       // Make API call
//       await deleteTransactionApi(id);
//     } catch (err) {
//       console.error('Error deleting transaction:', err);
//       setError('Failed to delete transaction. Please try again.');
//       fetchData(); // Fallback to full refresh if error occurs
//     }
//   };

//   // Optimistic update for add/update
//   const updateTransactionList = (updatedTransaction, isNew = false) => {
//     setTransactions(prev => {
//       if (isNew) {
//         return [updatedTransaction, ...prev].sort((a, b) => 
//           new Date(b.date) - new Date(a.date)
//         );
//       } else {
//         return prev.map(tx => 
//           tx.id === updatedTransaction.id ? updatedTransaction : tx
//         );
//       }
//     });

//     // Update totals
//     if (isNew || updatedTransaction.type === 'credit') {
//       setTotals(prev => ({
//         credit: isNew 
//           ? prev.credit + updatedTransaction.amount 
//           : prev.credit,
//         debit: prev.debit
//       }));
//     } else {
//       setTotals(prev => ({
//         credit: prev.credit,
//         debit: isNew 
//           ? prev.debit + updatedTransaction.amount 
//           : prev.debit
//       }));
//     }
//   };

//   // return (
//   //   <AppContext.Provider value={{
//   //     transactions,
//   //     totals,
//   //     last7Days,
//   //     profile,
//   //     loading,
//   //     error,
//   //     fetchData,
//   //     refreshTransactions,
//   //     deleteTransaction,
//   //     updateTransactionList
//   //   }}>
//   //     {children}
//   //   </AppContext.Provider>
//   // );
//   return (
//     <AppContext.Provider value={{
//       transactions,
//       setTransactions, // Add this line
//       totals,
//       setTotals, // Add this line
//       last7Days,
//       profile,
//       loading,
//       error,
//       fetchData,
//       refreshTransactions,
//       updateTransactionList
//     }}>
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const useAppContext = () => useContext(AppContext);