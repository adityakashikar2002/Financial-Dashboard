import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import TransactionList from '../../components/TransactionList/TransactionList';
import { Link } from 'react-router-dom';
import { PAGE_SIZE } from '../../utils/constants';
import { deleteTransaction as deleteTransactionApi } from '../../services/api';
import { FiRefreshCw, FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import './Transactions.css';

const Transactions = () => {
  const {
    transactions,
    loading,
    error,
    fetchData
  } = useAppContext();

  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredTransactions = transactions.filter(tx => {
    if (activeTab === 'all') return true;
    return tx.type === activeTab;
  });

  const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransactionApi(id);
      await fetchData();
      // Success notification could be added here
    } catch (err) {
      console.error('Error deleting transaction:', err);
      // Error notification could be added here
    }
  };

  // Animation variants
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
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/add-transaction" className="add-button">
                <FiPlus className="plus-icon" />
                Add Transaction
              </Link>
            </motion.div>
          </div>
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
                key={`${activeTab}-${currentPage}`}
                transactions={paginatedTransactions}
                showCheckbox={false}
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