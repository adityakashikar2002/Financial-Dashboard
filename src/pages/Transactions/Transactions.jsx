// import React, { useState, useEffect } from 'react';
// import { useAppContext } from '../../context/AppContext';
// import TransactionList from '../../components/TransactionList/TransactionList';
// import { Link } from 'react-router-dom';
// import { PAGE_SIZE } from '../../utils/constants';
// import { deleteTransaction as deleteTransactionApi, getCreditDebitTotals, getLast7DaysTotals } from '../../services/api';
// import { FiRefreshCw, FiPlus, FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';
// import { motion, AnimatePresence } from 'framer-motion';
// import { CATEGORIES } from '../../utils/constants';
// import './Transactions.css';

// const Transactions = () => {
//   // const {
//   //   transactions,
//   //   loading,
//   //   error,
//   //   fetchData
//   // } = useAppContext();
//   const {
//     transactions,
//     setTransactions, // Get from context
//     totals,
//     setTotals, // Get from context
//     loading,
//     error,
//     fetchData
//   } = useAppContext();

//   const [activeTab, setActiveTab] = useState('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [last7Days, setLast7Days] = useState([]);

//   const [filters, setFilters] = useState({
//     search: '',
//     category: 'all',
//     type: 'all',
//     amountMin: '',
//     amountMax: '',
//     dateFrom: '',
//     dateTo: ''
//   });

//   const filteredTransactions = transactions.filter(tx => {
//     if (filters.search && 
//         !tx.transaction_name.toLowerCase().includes(filters.search.toLowerCase()) &&
//         !tx.category.toLowerCase().includes(filters.search.toLowerCase())) {
//       return false;
//     }
    
//     if (filters.category !== 'all' && tx.category !== filters.category) return false;
//     if (filters.type !== 'all' && tx.type !== filters.type) return false;
    
//     if (filters.amountMin && tx.amount < Number(filters.amountMin)) return false;
//     if (filters.amountMax && tx.amount > Number(filters.amountMax)) return false;
    
//     const txDate = new Date(tx.date);
//     if (filters.dateFrom && txDate < new Date(filters.dateFrom)) return false;
//     if (filters.dateTo && txDate > new Date(filters.dateTo + 'T23:59:59')) return false;
    
//     return true;
//   });

//   const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE);
//   const paginatedTransactions = filteredTransactions.slice(
//     (currentPage - 1) * PAGE_SIZE,
//     currentPage * PAGE_SIZE
//   );

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [filters]);

//   const handleRefresh = async () => {
//     setIsRefreshing(true);
//     await fetchData();
//     setIsRefreshing(false);
//   };

//   // const handleDeleteTransaction = async (id) => {
//   //   try {
//   //     await deleteTransactionApi(id);
//   //     await fetchData();
//   //   } catch (err) {
//   //     console.error('Error deleting transaction:', err);
//   //   }
//   // };

//   const handleDeleteTransaction = async (id) => {
//     try {
//       // Optimistic update
//       const newTransactions = transactions.filter(tx => tx.id !== id);
//       setTransactions(newTransactions);
      
//       // Make API call
//       await deleteTransactionApi(id);
      
//       // Update summary data (if needed)
//       const [totalsData, last7DaysData] = await Promise.all([
//         getCreditDebitTotals(),
//         getLast7DaysTotals()
//       ]);
      
//       const creditTotal = totalsData.find(t => t.type === 'credit')?.sum || 0;
//       const debitTotal = totalsData.find(t => t.type === 'debit')?.sum || 0;
      
//       setTotals({ credit: creditTotal, debit: debitTotal });
//       setLast7Days(last7DaysData);
      
//     } catch (err) {
//       console.error('Error deleting transaction:', err);
//       fetchData(); // Fallback to full refresh
//     }
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         duration: 0.5
//       }
//     }
//   };

//   const clearFilters = () => {
//     setFilters({
//       search: '',
//       category: 'all',
//       type: 'all',
//       amountMin: '',
//       amountMax: '',
//       dateFrom: '',
//       dateTo: ''
//     });
//   };

//   return (
//     <motion.div 
//       className="transactions-page"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//     >
//       <div className="">
//         <div className="transactions-header">
//           <motion.h1 
//             className="page-title"
//             initial={{ x: -20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ duration: 0.5 }}
//           >
//             Transaction History
//           </motion.h1>
          
//           <div className="header-actions">
//             <motion.button 
//               onClick={handleRefresh} 
//               disabled={loading} 
//               className="refresh-button"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <FiRefreshCw className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`} />
//               {isRefreshing ? 'Refreshing...' : 'Refresh'}
//             </motion.button>
            
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <Link to="/add-transaction" className="add-button">
//                 <FiPlus className="plus-icon" />
//                 Add Transaction
//               </Link>
//             </motion.div>
//           </div>
//         </div>

//         <div className="search-bar-container">
//           <div className="search-bar">
//             <FiSearch className="search-icon" />
//             <input
//               type="text"
//               placeholder="Search transactions..."
//               value={filters.search}
//               onChange={(e) => setFilters({...filters, search: e.target.value})}
//             />
//           </div>
//         </div>

//         <div className="filters-container">
//           <div className="filter-row">
//             <div className="filter-group">
//               <label>Type</label>
//               <select
//                 value={filters.type}
//                 onChange={(e) => setFilters({...filters, type: e.target.value})}
//               >
//                 <option value="all">All Types</option>
//                 <option value="credit">Credit</option>
//                 <option value="debit">Debit</option>
//               </select>
//             </div>
            
//             <div className="filter-group">
//               <label>Category</label>
//               <select
//                 value={filters.category}
//                 onChange={(e) => setFilters({...filters, category: e.target.value})}
//               >
//                 <option value="all">All Categories</option>
//                 {CATEGORIES.map(category => (
//                   <option key={category} value={category}>{category}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="filter-row">
//             <div className="filter-group">
//               <label>Amount Range</label>
//               <div className="range-inputs">
//                 <input
//                   type="number"
//                   placeholder="Min"
//                   value={filters.amountMin}
//                   onChange={(e) => setFilters({...filters, amountMin: e.target.value})}
//                 />
//                 <span>to</span>
//                 <input
//                   type="number"
//                   placeholder="Max"
//                   value={filters.amountMax}
//                   onChange={(e) => setFilters({...filters, amountMax: e.target.value})}
//                 />
//               </div>
//             </div>
            
//             <div className="filter-group">
//               <label>Date Range</label>
//               <div className="date-inputs">
//                 <input
//                   type="date"
//                   value={filters.dateFrom}
//                   onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
//                 />
//                 <span>to</span>
//                 <input
//                   type="date"
//                   value={filters.dateTo}
//                   onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
//                 />
//               </div>
//             </div>
//           </div>

//           <button 
//             className="clear-filters-btn"
//             onClick={clearFilters}
//           >
//             Clear All Filters
//           </button>
//         </div>

//         <motion.div 
//           className="transactions-tabs"
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           <motion.button
//             className={`tab ${activeTab === 'all' ? 'active' : ''}`}
//             onClick={() => setActiveTab('all')}
//             variants={itemVariants}
//           >
//             All Transactions
//           </motion.button>
//           <motion.button
//             className={`tab ${activeTab === 'debit' ? 'active' : ''}`}
//             onClick={() => setActiveTab('debit')}
//             variants={itemVariants}
//           >
//             Debit
//           </motion.button>
//           <motion.button
//             className={`tab ${activeTab === 'credit' ? 'active' : ''}`}
//             onClick={() => setActiveTab('credit')}
//             variants={itemVariants}
//           >
//             Credit
//           </motion.button>
//         </motion.div>

//         {error ? (
//           <motion.div 
//             className="error-message"
//             initial={{ scale: 0.8, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//           >
//             {error}
//           </motion.div>
//         ) : (
//           <>
//             <AnimatePresence mode="wait">
//               <TransactionList
//                 transactions={paginatedTransactions}
//                 loading={loading}
//                 onDelete={handleDeleteTransaction}
//               />
//             </AnimatePresence>

//             {totalPages > 1 && (
//               <motion.div 
//                 className="pagination"
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//               >
//                 <motion.button
//                   onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                   disabled={currentPage === 1}
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                 >
//                   <FiChevronLeft />
//                 </motion.button>
                
//                 <span>
//                   Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
//                 </span>
                
//                 <motion.button
//                   onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                   disabled={currentPage === totalPages}
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                 >
//                   <FiChevronRight />
//                 </motion.button>
//               </motion.div>
//             )}
//           </>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default Transactions;



import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import TransactionList from '../../components/TransactionList/TransactionList';
import { Link } from 'react-router-dom';
import { PAGE_SIZE } from '../../utils/constants';
import { deleteTransaction as deleteTransactionApi, getCreditDebitTotals, getLast7DaysTotals } from '../../services/api';
import { FiRefreshCw, FiPlus, FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES } from '../../utils/constants';
import { isAdmin } from '../../services/auth';
import './Transactions.css';

const Transactions = () => {
  // const {
  //   transactions,
  //   loading,
  //   error,
  //   fetchData
  // } = useAppContext();
  const {
    transactions,
    setTransactions, // Get from context
    totals,
    setTotals, // Get from context
    loading,
    error,
    fetchData
  } = useAppContext();

  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [last7Days, setLast7Days] = useState([]);
  const adminDisabled = isAdmin();

  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    type: 'all',
    amountMin: '',
    amountMax: '',
    dateFrom: '',
    dateTo: ''
  });

  const filteredTransactions = transactions.filter(tx => {
    if (filters.search && 
        !tx.transaction_name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !tx.category.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    if (filters.category !== 'all' && tx.category !== filters.category) return false;
    if (filters.type !== 'all' && tx.type !== filters.type) return false;
    
    if (filters.amountMin && tx.amount < Number(filters.amountMin)) return false;
    if (filters.amountMax && tx.amount > Number(filters.amountMax)) return false;
    
    const txDate = new Date(tx.date);
    if (filters.dateFrom && txDate < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && txDate > new Date(filters.dateTo + 'T23:59:59')) return false;
    
    return true;
  });

  const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  // const handleDeleteTransaction = async (id) => {
  //   try {
  //     await deleteTransactionApi(id);
  //     await fetchData();
  //   } catch (err) {
  //     console.error('Error deleting transaction:', err);
  //   }
  // };

  const handleDeleteTransaction = async (id) => {
    try {
      // Optimistic update
      const newTransactions = transactions.filter(tx => tx.id !== id);
      setTransactions(newTransactions);
      
      // Make API call
      await deleteTransactionApi(id);
      
      // Update summary data (if needed)
      const [totalsData, last7DaysData] = await Promise.all([
        getCreditDebitTotals(),
        getLast7DaysTotals()
      ]);
      
      const creditTotal = totalsData.find(t => t.type === 'credit')?.sum || 0;
      const debitTotal = totalsData.find(t => t.type === 'debit')?.sum || 0;
      
      setTotals({ credit: creditTotal, debit: debitTotal });
      setLast7Days(last7DaysData);
      
    } catch (err) {
      console.error('Error deleting transaction:', err);
      fetchData(); // Fallback to full refresh
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      type: 'all',
      amountMin: '',
      amountMax: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  return (
    <motion.div 
      className="transactions-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="">
        <div className="transactions-header">
          <motion.h1 
            className="page-title"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Transaction History
          </motion.h1>
          
          <div className="header-actions">
            <motion.button 
              onClick={handleRefresh} 
              disabled={loading} 
              className="refresh-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiRefreshCw className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </motion.button>
            {!adminDisabled && (
              <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            > 
              <Link to="/add-transaction" className="add-button">
                <FiPlus className="plus-icon" />
                Add Transaction
              </Link>
            </motion.div>
            )}
          </div>
        </div>

        <div className="search-bar-container">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
        </div>

        <div className="filters-container">
          <div className="filter-row">
            <div className="filter-group">
              <label>Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
              >
                <option value="all">All Types</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Amount Range</label>
              <div className="range-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.amountMin}
                  onChange={(e) => setFilters({...filters, amountMin: e.target.value})}
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.amountMax}
                  onChange={(e) => setFilters({...filters, amountMax: e.target.value})}
                />
              </div>
            </div>
            
            <div className="filter-group">
              <label>Date Range</label>
              <div className="date-inputs">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                />
                <span>to</span>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button 
            className="clear-filters-btn"
            onClick={clearFilters}
          >
            Clear All Filters
          </button>
        </div>

        <motion.div 
          className="transactions-tabs"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.button
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
            variants={itemVariants}
          >
            All Transactions
          </motion.button>
          <motion.button
            className={`tab ${activeTab === 'debit' ? 'active' : ''}`}
            onClick={() => setActiveTab('debit')}
            variants={itemVariants}
          >
            Debit
          </motion.button>
          <motion.button
            className={`tab ${activeTab === 'credit' ? 'active' : ''}`}
            onClick={() => setActiveTab('credit')}
            variants={itemVariants}
          >
            Credit
          </motion.button>
        </motion.div>

        {error ? (
          <motion.div 
            className="error-message"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {error}
          </motion.div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <TransactionList
                transactions={paginatedTransactions}
                loading={loading}
                onDelete={handleDeleteTransaction}
              />
            </AnimatePresence>

            {totalPages > 1 && (
              <motion.div 
                className="pagination"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <motion.button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiChevronLeft />
                </motion.button>
                
                <span>
                  Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                </span>
                
                <motion.button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiChevronRight />
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Transactions;