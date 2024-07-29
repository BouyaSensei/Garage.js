import { useState, useEffect } from 'react';

import './index.css';


import { useNavigate } from 'react-router-dom';

const baseURI = import.meta.env.VITE_API_BASE_URL 
const Dashboard = () => {
  const [clientCount, setClientCount] = useState(0);
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
   
    if (!token) {
      navigate('/auth');
    } else {
      // Utilisez le token ici pour vérifier l'authentification ou effectuer d'autres actions
      console.log('Token récupéré:', token);
      fetchClients();
    }
  }, [navigate]);
 
  const fetchClients = async () => {
    try {
      const response = await fetch(baseURI + 'api/dashboard/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log(data);
      setClients(data.clients);
      setClientCount(data.clients.length);
     
    
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
    }
  };

  const handleDeleteClient = async (clientId) => {
    try {
      await fetch.delete(`/api/dashboard/client/${clientId}`);
      fetchClients(); // Mettre à jour la liste et le compte après la suppression
    } catch (error) {
      console.error('Erreur lors de la suppression du client:', error);
    }
  };

  return (
    <div className="dashboard">
      <h1>Tableau de bord</h1>
      <p>Nombre de clients : {clientCount}</p>
      <ul className="client-list">
        {clients.map((client) => (
          <li key={client.id} className="client-item">
            <span style={{ color: 'black' }}>{client.nom}</span>
            <button 
              className="delete-button" 
              onClick={() => handleDeleteClient(client.id)}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
