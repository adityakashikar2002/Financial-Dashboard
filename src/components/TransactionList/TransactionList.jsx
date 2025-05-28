// src/components/TransactionList/TransactionList.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/formatters';
import { TransactionListSkeleton } from '../SkeletonLoader/SkeletonLoader';
import { format, parseISO } from 'date-fns';
import './TransactionList.css';
import { isAdmin } from '../../services/auth';
import { FiUser } from 'react-icons/fi';
import { useUserProfiles } from '../../hooks/useUserProfiles';

const TransactionList = ({ transactions, loading: transactionsLoading, onDelete }) => {
  const navigate = useNavigate();
  const adminView = isAdmin();
  
  const userIds = React.useMemo(() => {
    if (!adminView || !transactions) return [];
    return transactions.map(tx => tx.user_id).filter(Boolean);
  }, [adminView, transactions]);

  const { profiles, loading: profilesLoading, error: profilesError } = useUserProfiles(userIds);

  const isLoading = transactionsLoading || (adminView && profilesLoading);

  if (isLoading) {
    return <TransactionListSkeleton />;
  }

  if (!transactions || transactions.length === 0) {
    return (
      <motion.div className="empty-state">
        <h3>No Transactions Found</h3>
        <p>You don't have any transactions yet. Add one to get started!</p>
      </motion.div>
    );
  }

  const handleEdit = (id, e) => {
    if (adminView) return;
    e.stopPropagation();
    navigate(`/edit-transaction/${id}`);
  };

  const handleDelete = async (id, e) => {
    if (adminView) return;
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await onDelete(id);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3
      }
    })
  };

  return (
    <div className="transaction-list-container">
      {profilesError && (
        <div className="error-message">
          Note: Some user information couldn't be loaded
        </div>
      )}
      
      <table className="transaction-table">
        <thead>
          <tr>
            {adminView && <th className="user-header">User</th>}
            <th>Transaction</th>
            <th>Category</th>
            <th>Date</th>
            <th>Amount</th>
            {!adminView && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <motion.tr 
              key={transaction.id}
              custom={index}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="transaction-row"
            >
              {adminView && (
                <td className="user-cell">
                  <div className="user-info">
                    <div className="user-avatar">
                      <FiUser size={16} />
                    </div>
                    <span className="user-name" title={profiles[transaction.user_id]?.email || ''}>
                      {profiles[transaction.user_id]?.name || `User ${transaction.user_id}`}
                    </span>
                  </div>
                </td>
              )}
              <td className="transaction-name">
                {transaction.transaction_name}
              </td>
              <td>
                <span className="category-badge">
                  {transaction.category}
                </span>
              </td>
              <td className="transaction-date">
                {format(parseISO(transaction.date), 'MMM dd, yyyy hh:mm a')}
              </td>
              <td className={`transaction-amount ${transaction.type}`}>
                {transaction.type === 'debit' ? '-' : '+'}
                {formatCurrency(transaction.amount)}
              </td>
              {!adminView && (
                <td className="actions">
                  <motion.button 
                    onClick={(e) => handleEdit(transaction.id, e)}
                    className="edit-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="edit-icon" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                    </svg>
                  </motion.button>
                  <motion.button 
                    onClick={(e) => handleDelete(transaction.id, e)}
                    className="delete-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="delete-icon" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                    </svg>
                  </motion.button>
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;