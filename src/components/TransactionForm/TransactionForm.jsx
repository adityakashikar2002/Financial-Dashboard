import React, { useState, useEffect } from 'react';
import { addTransaction, updateTransaction } from '../../services/api';
import './TransactionForm.css';

const TransactionForm = ({ transaction, isEdit, onSuccess }) => {

  // State for form fields
  const [formData, setFormData] = useState({
    transaction_name: transaction?.transaction_name || '',
    type: transaction?.type || 'debit',
    category: transaction?.category || '',
    amount: transaction?.amount || '',
    date: transaction?.date || new Date().toISOString() // Keep ISO string for initial state
  });

  // State for date/time inputs
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('12:00'); // Default to 12:00
  const [ampm, setAmpm] = useState('AM'); // Default to AM
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize form with existing transaction data or current date/time
  useEffect(() => {
    const initializeDateTime = (dateObj) => {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      setDateInput(`${year}-${month}-${day}`);

      let hours = dateObj.getHours();
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      setAmpm(hours >= 12 ? 'PM' : 'AM');
      hours = hours % 12 || 12; // Convert to 12-hour format
      setTimeInput(`${String(hours).padStart(2, '0')}:${minutes}`);
    };

    if (transaction?.date) {
      // For existing transaction, parse the ISO string into a Date object
      // and then use its local components
      const date = new Date(transaction.date);
      initializeDateTime(date);
    } else {
      // For new transaction, use current local date and time
      const now = new Date();
      initializeDateTime(now);
    }
  }, [transaction]);

  // Update formData.date whenever date/time inputs change
  useEffect(() => {
    if (dateInput && timeInput) {
      const [year, month, day] = dateInput.split('-').map(Number);
      const [hoursStr, minutesStr] = timeInput.split(':');
      let hourNumber = parseInt(hoursStr, 10);
      const minuteNumber = parseInt(minutesStr, 10);

      // Convert to 24-hour format
      if (ampm === 'PM' && hourNumber < 12) {
        hourNumber += 12;
      }
      if (ampm === 'AM' && hourNumber === 12) {
        hourNumber = 0; // 12 AM is 0 hours
      }

      // Create a Date object in the local timezone
      const localDate = new Date(year, month - 1, day, hourNumber, minuteNumber, 0);

      // Convert this local Date object to an ISO string
      // The toISOString() method always returns a UTC string,
      // but by creating the Date object in the local timezone first,
      // it correctly represents the chosen local time.
      setFormData(prev => ({ ...prev, date: localDate.toISOString() }));
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
    setLoading(true);
    setError(null);

    try {
      if (isEdit) {
        await updateTransaction({
          id: transaction.id,
          ...formData
        });
      } else {
        await addTransaction(formData);
      }

      if (onSuccess) onSuccess();
      alert(`Transaction ${isEdit ? 'updated' : 'added'} successfully!`);
    } catch (err) {
      console.error('Error saving transaction:', err);
      setError('Failed to save transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-form">
      <h1>{isEdit ? 'Update Transaction' : 'Add Transaction'}</h1>

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

        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          />
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
              step="300" // 5 minute increments
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

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update Transaction' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;