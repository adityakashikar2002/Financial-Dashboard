import React from 'react';
import { useAppContext } from '../../context/AppContext';
import StatsCards from '../../components/StatsCards/StatsCards';
import TransactionList from '../../components/TransactionList/TransactionList';
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

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleRefresh} disabled={loading}>
          Refresh
        </button>
      </div>
      
      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <StatsCards 
            creditTotal={totals.credit} 
            debitTotal={totals.debit} 
            last7Days={last7Days} 
            loading={loading}
          />
          
          <div className="dashboard-section">
            <h2>Last Transaction</h2>
            <TransactionList 
              transactions={transactions.slice(0, 3)} 
              showCheckbox 
              loading={loading}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;