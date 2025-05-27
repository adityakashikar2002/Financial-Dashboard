// TransactionForm.jsx
import React, { useState, useEffect } from 'react';
import { addTransaction, updateTransaction } from '../../services/api';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { FiSave } from 'react-icons/fi';
import { CATEGORIES } from '../../utils/constants';
import './TransactionForm.css';
import { useAppContext } from '../../context/AppContext';
import { isAdmin } from '../../services/auth';

const TransactionForm = ({ transaction, isEdit, onSuccess }) => {
  const { updateTransactionList } = useAppContext();
  const [formData, setFormData] = useState({
    transaction_name: transaction?.transaction_name || '',
    type: transaction?.type || 'debit',
    category: transaction?.category || '',
    amount: transaction?.amount || '',
    date: transaction?.date || new Date().toISOString()
  });

  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('12:00');
  const [ampm, setAmpm] = useState('AM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const adminDisabled = isAdmin();

  useEffect(() => {
    const initializeDateTime = (dateObj) => {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      setDateInput(`${year}-${month}-${day}`);

      let hours = dateObj.getHours();
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      setAmpm(hours >= 12 ? 'PM' : 'AM');
      hours = hours % 12 || 12;
      setTimeInput(`${String(hours).padStart(2, '0')}:${minutes}`);
    };

    if (transaction?.date) {
      const date = parseISO(transaction.date);
      initializeDateTime(date);
    } else {
      const now = new Date();
      initializeDateTime(now);
    }
  }, [transaction]);

  useEffect(() => {
    if (dateInput && timeInput) {
      const [year, month, day] = dateInput.split('-').map(Number);
      const [hoursStr, minutesStr] = timeInput.split(':');
      let hourNumber = parseInt(hoursStr, 10);
      const minuteNumber = parseInt(minutesStr, 10);

      if (ampm === 'PM' && hourNumber < 12) {
        hourNumber += 12;
      }
      if (ampm === 'AM' && hourNumber === 12) {
        hourNumber = 0;
      }

      // Create date in local timezone
      const date = new Date(year, month - 1, day, hourNumber, minuteNumber);
      
      // Convert to ISO string while preserving local time
      const isoString = date.toISOString();
      
      setFormData(prev => ({ ...prev, date: isoString }));
    }
  }, [dateInput, timeInput, ampm]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    setDateInput(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTimeInput(e.target.value);
  };

  const handleAmpmChange = (e) => {
    setAmpm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (adminDisabled) {
      setError('Admin cannot perform this operation');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let result;
      if (isEdit) {
        updateTransactionList({
          ...transaction,
          ...formData
        }, false);
        
        result = await updateTransaction({
          id: transaction.id,
          ...formData
        });
      } else {
        result = await addTransaction(formData);
        updateTransactionList(result, true);
      }

      if (onSuccess) onSuccess();
      alert(`Transaction ${isEdit ? 'updated' : 'added'} successfully!`);
    } catch (err) {
      console.error('Error saving transaction:', err);
      setError(err.message || 'Failed to save transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-form">
      <h1>{isEdit ? 'Update Transaction' : 'Add Transaction'}</h1>
      
      {adminDisabled && (
        <div className="admin-notice">
          <p>Admin view only. Modifications are disabled.</p>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Transaction Name</label>
          <input
            type="text"
            name="transaction_name"
            value={formData.transaction_name}
            onChange={handleInputChange}
            required
            disabled={adminDisabled}
          />
        </div>

        <div className="form-group">
          <label>Transaction Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
          >
            <option value="debit">Debit</option>
            <option value="credit">Credit</option>
          </select>
        </div>

        {/* <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          />
        </div> */}
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a category</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={dateInput}
            onChange={handleDateChange}
            required
          />
        </div>

        <div className="time-input-group">
          <label>Time</label>
          <div className="time-inputs">
            <input
              type="time"
              value={timeInput}
              onChange={handleTimeChange}
              required
              step="300"
            />
            <select
              value={ampm}
              onChange={handleAmpmChange}
              className="ampm-select"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>

        {/* <button type="submit" disabled={loading} >
          {loading ? 'Saving...' : isEdit ? 'Update Transaction' : 'Add Transaction'}
        </button> */}
        {!adminDisabled && (
          <motion.button 
            type="submit" 
            className="submit-button"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <FiSave className="save-icon" />
            {loading ? 'Saving...' : isEdit ? 'Update Transaction' : 'Add Transaction'}
          </motion.button>
        )}
      </form>
    </div>
  );
};

export default TransactionForm;