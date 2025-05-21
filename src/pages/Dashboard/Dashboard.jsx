// import React from 'react';
// import { useAppContext } from '../../context/AppContext';
// import StatsCards from '../../components/StatsCards/StatsCards';
// import TransactionList from '../../components/TransactionList/TransactionList';
// import './Dashboard.css';

// const Dashboard = () => {
//   const { 
//     totals, 
//     last7Days, 
//     transactions, 
//     loading, 
//     error,
//     fetchData
//   } = useAppContext();

//   const handleRefresh = () => {
//     fetchData();
//   };

//   return (
//     <div className="dashboard">
//       <div className="dashboard-header">
//         <h1>Dashboard</h1>
//         <button onClick={handleRefresh} disabled={loading}>
//           Refresh
//         </button>
//       </div>
      
//       {error ? (
//         <div className="error-message">{error}</div>
//       ) : (
//         <>
//           <StatsCards 
//             creditTotal={totals.credit} 
//             debitTotal={totals.debit} 
//             last7Days={last7Days} 
//             loading={loading}
//           />
          
//           <div className="dashboard-section">
//             <h2>Last Transaction</h2>
//             <TransactionList 
//               transactions={transactions.slice(0, 3)} 
//               showCheckbox 
//               loading={loading}
//             />
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

import React from 'react';
import { useAppContext } from '../../context/AppContext';
import StatsCards from '../../components/StatsCards/StatsCards';
import TransactionList from '../../components/TransactionList/TransactionList';
import BarChart from '../../components/Charts/BarChart';
import PieChart from '../../components/Charts/PieChart';
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

  // Prepare data for charts
  const chartData = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Credit',
        data: last7Days.map(day => day.credit),
        backgroundColor: '#4ade80',
      },
      {
        label: 'Debit',
        data: last7Days.map(day => day.debit),
        backgroundColor: '#f87171',
      }
    ]
  };

  const pieData = {
    labels: ['Credit', 'Debit'],
    datasets: [{
      data: [totals.credit, totals.debit],
      backgroundColor: ['#4ade80', '#f87171'],
      hoverBackgroundColor: ['#22c55e', '#ef4444']
    }]
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleRefresh} disabled={loading} className="refresh-btn">
          {loading ? 'Refreshing...' : 'Refresh Data'}
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
          
          <div className="charts-section">
            <div className="chart-container">
              <h2>Weekly Overview</h2>
              <BarChart data={chartData} />
            </div>
            <div className="chart-container">
              <h2>Balance Distribution</h2>
              <PieChart data={pieData} />
            </div>
          </div>
          
          <div className="recent-transactions">
            <h2>Recent Transactions</h2>
            <TransactionList 
              transactions={transactions.slice(0, 5)} 
              showCheckbox={false}
              loading={loading}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;