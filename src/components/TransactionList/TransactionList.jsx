// import React from 'react';
// import { Link } from 'react-router-dom';
// import { formatCurrency, formatDate } from '../../utils/formatters';
// import { SkeletonLoader, TransactionListSkeleton } from '../SkeletonLoader/SkeletonLoader';
// import './TransactionList.css';

// const TransactionList = ({ transactions, showCheckbox, loading, onTransactionClick }) => {
//   if (loading) return <TransactionListSkeleton />;

//   if (!transactions || transactions.length === 0) {
//     return <div className="no-transactions">No transactions found</div>;
//   }

//   return (
//     <div className="transaction-list-container">
//       {showCheckbox ? (
//         <div className="transaction-items">
//           {transactions.map((transaction) => (
//             <div 
//               key={transaction.id} 
//               className="transaction-item"
//               onClick={() => onTransactionClick && onTransactionClick(transaction)}
//             >
//               {showCheckbox && (
//                 <input 
//                   type="checkbox" 
//                   className="transaction-checkbox" 
//                 />
//               )}
//               <div className="transaction-details">
//                 <div className="transaction-name">{transaction.transaction_name}</div>
//                 <div className="transaction-category">{transaction.category}</div>
//                 <div className="transaction-date">{formatDate(transaction.date)}</div>
//               </div>
//               <div className={`transaction-amount ${transaction.type}`}>
//                 {transaction.type === 'debit' ? '-' : '+'}
//                 {formatCurrency(transaction.amount)}
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <table className="transaction-table">
//           <thead>
//             <tr>
//               <th>Transaction Name</th>
//               <th>Category</th>
//               <th>Date</th>
//               <th>Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             {transactions.map((transaction) => (
//               <tr 
//                 key={transaction.id}
//                 onClick={() => onTransactionClick && onTransactionClick(transaction)}
//               >
//                 <td>
//                   <Link to={`/edit-transaction/${transaction.id}`}>
//                     {transaction.transaction_name}
//                   </Link>
//                 </td>
//                 <td>{transaction.category}</td>
//                 <td>{formatDate(transaction.date)}</td>
//                 <td className={transaction.type}>
//                   {transaction.type === 'debit' ? '-' : '+'}
//                   {formatCurrency(transaction.amount)}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default TransactionList;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { SkeletonLoader, TransactionListSkeleton } from '../SkeletonLoader/SkeletonLoader';
import './TransactionList.css';

const TransactionList = ({ transactions, loading, onDelete }) => {
  const navigate = useNavigate();

  if (loading) return <TransactionListSkeleton />;

  if (!transactions || transactions.length === 0) {
    return <div className="no-transactions">No transactions found</div>;
  }

  const handleEdit = (id, e) => {
    e.stopPropagation();
    navigate(`/edit-transaction/${id}`);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await onDelete(id);
    }
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.transaction_name}</td>
              <td>{transaction.category}</td>
              <td>{formatDate(transaction.date)}</td>
              <td className={transaction.type}>
                {transaction.type === 'debit' ? '-' : '+'}
                {formatCurrency(transaction.amount)}
              </td>
              <td className="actions">
                <button 
                  onClick={(e) => handleEdit(transaction.id, e)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button 
                  onClick={(e) => handleDelete(transaction.id, e)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;