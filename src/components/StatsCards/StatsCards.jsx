import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { SkeletonLoader, StatsCardsSkeleton } from '../SkeletonLoader/SkeletonLoader';
import './StatsCards.css';

const StatsCards = ({ creditTotal, debitTotal, last7Days, loading }) => {
  if (loading) return <StatsCardsSkeleton />;

  return (
    <>
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Balance</h3>
          <p className="amount">
            {formatCurrency(creditTotal - debitTotal)}
          </p>
        </div>
        
        <div className="stat-card credit">
          <h3>Credit</h3>
          <p className="amount">{formatCurrency(creditTotal)}</p>
        </div>
        
        <div className="stat-card debit">
          <h3>Debit</h3>
          <p className="amount">{formatCurrency(debitTotal)}</p>
        </div>
      </div>
      
      <div className="week-overview">
        <h2>Debit & Credit Overview</h2>
        <p>
          {formatCurrency(debitTotal)} Debited & {formatCurrency(creditTotal)} 
          Credited in this Week
        </p>
        
        <div className="week-days">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="day">
              {day}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default StatsCards;