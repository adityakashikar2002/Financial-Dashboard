// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import StatsCards from '../../components/StatsCards/StatsCards';
import TransactionList from '../../components/TransactionList/TransactionList';
import BarChart from '../../components/Charts/BarChart';
import PieChart from '../../components/Charts/PieChart';
import LineChart from '../../components/Charts/LineChart';
import { formatCurrency } from '../../utils/formatters';
import { deleteTransaction as deleteTransactionApi } from '../../services/api';
import { motion } from 'framer-motion';
import { subDays, format, parseISO, isSameDay } from 'date-fns';
import { FiRefreshCw } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const {
    totals,
    last7Days,
    transactions,
    loading,
    error,
    fetchData
  } = useAppContext();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Function to group transactions by day and type
  const groupTransactionsByDay = (transactions) => {
    const now = new Date();
    const days = Array.from({ length: 7 }, (_, i) => subDays(now, i)).reverse();
    
    // Initialize dayMap with all 7 days
    const dayMap = days.reduce((acc, day) => {
      const dateKey = format(day, 'yyyy-MM-dd');
      acc[dateKey] = {
        date: dateKey,
        credit: 0,
        debit: 0
      };
      return acc;
    }, {});

    // Process transactions
    transactions.forEach(transaction => {
      const transactionDate = parseISO(transaction.date);
      const dateKey = format(transactionDate, 'yyyy-MM-dd');
      
      // Only consider transactions from the last 7 days
      if (dayMap[dateKey]) {
        if (transaction.type === 'credit') {
          dayMap[dateKey].credit += transaction.amount;
        } else {
          dayMap[dateKey].debit += transaction.amount;
        }
      }
    });

    // Convert to array and format for charts
    return Object.values(dayMap).map(day => ({
      date: day.date,
      credit: day.credit,
      debit: day.debit
    }));
  };

  // Prepare chart data using the grouped transactions
  const chartData = groupTransactionsByDay(transactions);

  // Calculate weekly totals
  const weeklyCredit = chartData.reduce((sum, day) => sum + day.credit, 0);
  const weeklyDebit = chartData.reduce((sum, day) => sum + day.debit, 0);

  // Prepare data for charts
  const barChartData = {
    labels: chartData.map(day => {
      try {
        return format(parseISO(day.date), 'EEE'); // Short day name
      } catch (e) {
        console.error('Error formatting date:', day.date, e);
        return '';
      }
    }),
    datasets: [
      {
        label: 'Credit',
        data: chartData.map(day => day.credit),
        backgroundColor: 'rgba(74, 222, 128, 0.8)',
        borderColor: 'rgba(74, 222, 128, 1)',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Debit',
        data: chartData.map(day => day.debit),
        backgroundColor: 'rgba(248, 113, 113, 0.8)',
        borderColor: 'rgba(248, 113, 113, 1)',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      }
    ]
  };

  const pieChartData = {
    labels: ['Credit', 'Debit'],
    datasets: [{
      data: [totals.credit, totals.debit],
      backgroundColor: ['rgba(74, 222, 128, 0.8)', 'rgba(248, 113, 113, 0.8)'],
      borderColor: ['rgba(74, 222, 128, 1)', 'rgba(248, 113, 113, 1)'],
      borderWidth: 2,
    }]
  };

  const lineChartData = {
    labels: chartData.map(day => format(parseISO(day.date), 'MMM dd')), // Month and day
    datasets: [
      {
        label: 'Daily Credit',
        data: chartData.map(day => day.credit),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#22c55e',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
        pointHoverBorderWidth: 2,
      },
      {
        label: 'Daily Debit',
        data: chartData.map(day => day.debit),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
        pointHoverBorderWidth: 2,
      }
    ]
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransactionApi(id);
        await fetchData();
      } catch (err) {
        console.error('Error deleting transaction:', err);
      }
    }
  };

  return (
    <motion.div 
      className="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="dashboard-header">
        <div className="header-content">
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Financial Dashboard
          </motion.h1>
          <p className="subtitle">Track and manage your finances effectively</p>
        </div>
        
        {/* <motion.button 
          onClick={handleRefresh} 
          disabled={loading || isRefreshing}
          className="refresh-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading || isRefreshing ? (
            <>
              <svg className="spinner" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
              </svg>
              Refreshing...
            </>
          ) : (
            <>
              <svg className="refresh-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
              </svg>
              Refresh Data
            </>
          )}
        </motion.button> */}
        <div className="header-actions">
          <motion.button 
            onClick={handleRefresh} 
            disabled={loading || isRefreshing}
            className="refresh-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiRefreshCw className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </motion.button>
        </div>
      </div>

      {error ? (
        <motion.div 
          className="error-message"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <svg className="error-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
          </svg>
          {error}
        </motion.div>
      ) : (
        <>
          <StatsCards
            creditTotal={totals.credit}
            debitTotal={totals.debit}
            last7Days={last7Days}
            loading={loading}
          />

          <div className="dashboard-tabs">
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
          </div>
          
          {activeTab === 'overview' ? (
            <>
              <div className="charts-grid">
                <motion.div 
                  className="chart-card large-card"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="chart-header">
                    <h2>Weekly Transaction Flow</h2>
                    <div className="chart-legend">
                      <div className="legend-item">
                        <span className="legend-color credit"></span>
                        <span>Credit</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color debit"></span>
                        <span>Debit</span>
                      </div>
                    </div>
                  </div>
                  <BarChart data={barChartData} />
                  <div className="chart-summary">
                    <div className="summary-item">
                      <span>Total Credit</span>
                      <span className="credit">{formatCurrency(weeklyCredit)}</span>
                    </div>
                    <div className="summary-item">
                      <span>Total Debit</span>
                      <span className="debit">{formatCurrency(weeklyDebit)}</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="chart-card"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="chart-header">
                    <h2>Balance Distribution</h2>
                  </div>
                  <PieChart data={pieChartData} />
                  <div className="chart-summary">
                    <div className="summary-item">
                      <span>Net Balance</span>
                      <span className={totals.credit - totals.debit >= 0 ? 'credit' : 'debit'}>
                        {formatCurrency(totals.credit - totals.debit)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div 
                className="chart-card full-width-card"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="chart-header">
                  <h2>Daily Trends</h2>
                </div>
                <LineChart data={lineChartData} />
                <div className="chart-summary">
                  <div className="summary-item">
                    <span>7-Day Change</span>
                    <span className={weeklyCredit - weeklyDebit >= 0 ? 'credit' : 'debit'}>
                      {formatCurrency(weeklyCredit - weeklyDebit)}
                    </span>
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            <motion.div 
              className="analytics-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="analytics-illustration">
                <img src='/finance.svg' alt="Financial analytics" style={{height: '40px', width: '40px'}}/>
                <h3>Advanced Analytics Coming Soon</h3>
                <p>We're working on more detailed financial insights for you</p>
              </div>
            </motion.div>
          )}
          <br />
          <motion.div 
            className="recent-transactions"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="section-header">
              <h2>Recent Transactions</h2>
              <button 
                className="view-all-btn"
                onClick={() => window.location.href = '/transactions'}
              >
                View All
              </button>
            </div>
            <TransactionList
              transactions={transactions.slice(0, 5)}
              loading={loading}
              onDelete={handleDeleteTransaction}
            />
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default Dashboard;