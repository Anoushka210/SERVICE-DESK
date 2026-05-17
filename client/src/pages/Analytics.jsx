import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import api from '../services/api';
import TicketMap from '../components/TicketMap';

const COLORS = ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6f42c1'];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tickets/analytics/summary')
      .then(res => { setData(res.data); setLoading(false); })
      .catch(err => console.error(err));
  }, []);

  if (loading) return (
    <div className="text-center mt-5">
      <div className="spinner-border text-primary" />
    </div>
  );

  return (
    <div className="container mt-4">
      <h4 className="mb-4">Analytics Dashboard</h4>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Tickets', value: data.totals.total, color: 'primary' },
          { label: 'Open', value: data.totals.open, color: 'danger' },
          { label: 'In Progress', value: data.totals.inProgress, color: 'warning' },
          { label: 'Resolved', value: data.totals.resolved, color: 'success' }
        ].map(card => (
          <div className="col-6 col-md-3" key={card.label}>
            <div className={`card border-${card.color} text-center p-3`}>
              <div className={`text-${card.color} fw-bold`} style={{ fontSize: 32 }}>
                {card.value}
              </div>
              <div className="text-muted small">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        {/* Tickets by Category */}
        <div className="col-md-6">
          <div className="card p-3">
            <h6 className="mb-3">Tickets by Category</h6>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.byCategory}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#0d6efd" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tickets by Status */}
        <div className="col-md-6">
          <div className="card p-3">
            <h6 className="mb-3">Tickets by Status</h6>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data.byStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {data.byStatus.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tickets over last 7 days */}
      <div className="card p-3 mb-4">
        <h6 className="mb-3">Tickets Raised — Last 7 Days</h6>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data.byDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#0d6efd"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Tickets"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Priority breakdown */}
      <div className="card p-3 mb-4">
        <h6 className="mb-3">Tickets by Priority</h6>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.byPriority} layout="vertical">
            <XAxis type="number" allowDecimals={false} />
            <YAxis dataKey="name" type="category" width={60} />
            <Tooltip />
            <Bar dataKey="value" fill="#6f42c1" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Map */}
      <TicketMap />
    </div>
  );
}