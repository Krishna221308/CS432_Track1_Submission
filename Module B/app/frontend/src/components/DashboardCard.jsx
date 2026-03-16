import React from 'react';

const DashboardCard = ({ title, value, icon, trend, color }) => {
  return (
    <div className="stats-card">
      <div className="card-content">
        <div className="stats-info">
          <p className="stats-title">{title}</p>
          <h3 className="stats-value">{value}</h3>
          {trend !== undefined && (
            <p className={`stats-trend ${trend >= 0 ? 'positive' : 'negative'}`}>
              {trend >= 0 ? '+' : ''}{trend}% vs last month
            </p>
          )}
        </div>
        <div className="stats-icon" style={{ backgroundColor: `${color}15`, color: color }}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
