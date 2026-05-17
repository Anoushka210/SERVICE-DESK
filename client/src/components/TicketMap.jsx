import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../services/api';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon bug in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function TicketMap() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    api.get('/tickets/map/locations').then(res => setTickets(res.data));
  }, []);

  return (
    <div className="card p-3 mt-4">
      <h6 className="mb-3">Ticket Locations</h6>
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: '420px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {tickets.map(ticket => (
          <Marker
            key={ticket._id}
            position={[ticket.location.lat, ticket.location.lng]}
          >
            <Popup>
              <strong>{ticket.title}</strong><br />
              Status: {ticket.status}<br />
              Priority: {ticket.priority}<br />
              By: {ticket.createdBy?.name}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}