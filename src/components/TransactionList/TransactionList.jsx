// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { formatCurrency } from '../../utils/formatters';
// import { TransactionListSkeleton } from '../SkeletonLoader/SkeletonLoader';
// import { format, parseISO } from 'date-fns';
// import './TransactionList.css';

// const TransactionList = ({ transactions, loading, onDelete }) => {
//   const navigate = useNavigate();

//   if (loading) return <TransactionListSkeleton />;

//   if (!transactions || transactions.length === 0) {
//     return (
//       <motion.div className="empty-state">
//         <h3>No Transactions Found</h3>
//         <p>You don't have any transactions yet. Add one to get started!</p>
//       </motion.div>
//     );
//   }

//   const handleEdit = (id, e) => {
//     e.stopPropagation();
//     navigate(`/edit-transaction/${id}`);
//   };

//   const handleDelete = async (id, e) => {
//     e.stopPropagation();
//     if (window.confirm('Are you sure you want to delete this transaction?')) {
//       await onDelete(id);
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: (i) => ({
//       opacity: 1,
//       y: 0,
//       transition: {
//         delay: i * 0.05,
//         duration: 0.3
//       }
//     })
//   };

//   return (
//     <div className="transaction-list-container">
//       <table className="transaction-table">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Category</th>
//             <th>Date</th>
//             <th>Amount</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {transactions.map((transaction, index) => (
//             <motion.tr 
//               key={transaction.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.05, duration: 0.3 }}
//               whileHover={{ scale: 1.01 }}
//               className="transaction-row"
//             >
//               <td className="transaction-name">
//                 {transaction.transaction_name}
//               </td>
//               <td>
//                 <span className="category-badge">
//                   {transaction.category}
//                 </span>
//               </td>
//               <td className="transaction-date">
//                 {format(parseISO(transaction.date), 'MMM dd, yyyy hh:mm a')}
//               </td>
//               <td className={`transaction-amount ${transaction.type}`}>
//                 {transaction.type === 'debit' ? '-' : '+'}
//                 {formatCurrency(transaction.amount)}
//               </td>
//               <td className="actions">
//                 <motion.button 
//                   onClick={(e) => handleEdit(transaction.id, e)}
//                   className="edit-btn"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <svg className="edit-icon" viewBox="0 0 24 24">
//                     <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
//                   </svg>
//                 </motion.button>
//                 <motion.button 
//                   onClick={(e) => handleDelete(transaction.id, e)}
//                   className="delete-btn"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <svg className="delete-icon" viewBox="0 0 24 24">
//                     <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
//                   </svg>
//                 </motion.button>
//               </td>
//             </motion.tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TransactionList;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/formatters';
import { TransactionListSkeleton } from '../SkeletonLoader/SkeletonLoader';
import { format, parseISO } from 'date-fns';
import './TransactionList.css';
import { isAdmin } from '../../services/auth';

const TransactionList = ({ transactions, loading, onDelete }) => {
  const navigate = useNavigate();
  const adminDisabled = isAdmin();

  if (loading) return <TransactionListSkeleton />;

  if (!transactions || transactions.length === 0) {
    return (
      <motion.div className="empty-state">
        <h3>No Transactions Found</h3>
        <p>You don't have any transactions yet. Add one to get started!</p>
      </motion.div>
    );
  }

  const handleEdit = (id, e) => {
    if (adminDisabled) return;
    e.stopPropagation();
    navigate(`/edit-transaction/${id}`);
  };

  const handleDelete = async (id, e) => {
    if (adminDisabled) return;
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
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Date</th>
            <th>Amount</th>
            {!adminDisabled && ( // Only render if not in admin mode
              <th>Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <motion.tr 
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.01 }}
              className="transaction-row"
            >
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
              <td className="actions">
                {!adminDisabled && (
                  <>
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
                  </>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;



// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { formatCurrency } from '../../utils/formatters';
// import { TransactionListSkeleton } from '../SkeletonLoader/SkeletonLoader';
// import { format, parseISO } from 'date-fns';
// import { isAdmin } from '../../services/auth';
// import './TransactionList.css';

// const TransactionList = ({ transactions, loading, onDelete }) => {
//   const adminMode = isAdmin(); // Add this line
//   const navigate = useNavigate();

//   if (loading) return <TransactionListSkeleton />;

//   if (!transactions || transactions.length === 0) {
//     return (
//       <motion.div className="empty-state">
//         <h3>No Transactions Found</h3>
//         <p>You don't have any transactions yet. Add one to get started!</p>
//       </motion.div>
//     );
//   }

//   const handleEdit = (id, e) => {
//     e.stopPropagation();
//     navigate(`/edit-transaction/${id}`);
//   };

//   const handleDelete = async (id, e) => {
//     e.stopPropagation();
//     if (window.confirm('Are you sure you want to delete this transaction?')) {
//       await onDelete(id);
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: (i) => ({
//       opacity: 1,
//       y: 0,
//       transition: {
//         delay: i * 0.05,
//         duration: 0.3
//       }
//     })
//   };

//   return (
//     <div className="transaction-list-container">
//       {adminMode && (
//         <div className="admin-notice">
//           <p>You are viewing transactions in admin mode. Modifications are disabled.</p>
//         </div>
//       )}
//       <table className="transaction-table">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Category</th>
//             <th>Date</th>
//             <th>Amount</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {transactions.map((transaction, index) => (
//             <motion.tr 
//               key={transaction.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.05, duration: 0.3 }}
//               whileHover={{ scale: 1.01 }}
//               className="transaction-row"
//             >
//               <td className="transaction-name">
//                 {transaction.transaction_name}
//               </td>
//               <td>
//                 <span className="category-badge">
//                   {transaction.category}
//                 </span>
//               </td>
//               <td className="transaction-date">
//                 {format(parseISO(transaction.date), 'MMM dd, yyyy hh:mm a')}
//               </td>
//               <td className={`transaction-amount ${transaction.type}`}>
//                 {transaction.type === 'debit' ? '-' : '+'}
//                 {formatCurrency(transaction.amount)}
//               </td>
//               {!adminMode && (
//                 <td className="actions">
//                   {/* Only show actions if not admin */}
//                   <motion.button 
//                     onClick={(e) => handleEdit(transaction.id, e)}
//                     className="edit-btn"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                   <svg className="edit-icon" viewBox="0 0 24 24">
//                     <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
//                   </svg>
//                 </motion.button>
//                 <motion.button 
//                   onClick={(e) => handleDelete(transaction.id, e)}
//                   className="delete-btn"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <svg className="delete-icon" viewBox="0 0 24 24">
//                     <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
//                   </svg>
//                 </motion.button>
//               </td>
//             )}
//             </motion.tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TransactionList;