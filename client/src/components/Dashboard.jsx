import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import './AdminDashboard.css';
const baseURI = import.meta.env.VITE_API_BASE_URL;

const AdminDashboard = () => {
  const [clientCount, setClientCount] = useState(0);
  const [vehicules, setVehicules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientCount = async () => {
      try {
        const response = await fetch(baseURI + 'api/clients/count', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setClientCount(data.count);
        } else {
          alert('Erreur lors de la récupération du nombre de clients');
          navigate('/')
        }
      } catch (error) {
        alert('Erreur réseau');
        navigate('/')
      }
    };
    const fetchVehicules = async () => {
      try {
        const response = await fetch(baseURI + 'api/vehicules/get', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          
          if(data.length > 0){
            setVehicules(data);
          }
          else{
            setVehicules([data]);
          }
        } 
      } catch (error) {
        
        alert('Erreur lors de la récupération des véhicules');
    }
    };
   
    fetchClientCount();
    fetchVehicules();
  }, [navigate,vehicules]);
  const fetchDeleteVehicules = (vehicule_id) => {
     fetch(baseURI +`api/vehicules/delete/${vehicule_id}`, {
      method: 'GET',
      credentials: 'include'
    })
    .then(() => {
      alert('Véhicule supprimé avec succès');
    })
    .catch((error) => {
      alert('Erreur lors de la suppression du véhicule');
    });
  };
 console.log(vehicules);

  return (
    <div className="admin-dashboard">
      <h2>Tableau de bord admin</h2>
      <p>Nombre de clients inscrits : {clientCount}</p>
      <div className="vehicules-list">
      
        <h3>Liste des véhicules</h3>
        <button onClick={() => navigate('/addVehicule')}> Ajouter un véhicule </button>
        <ul>
              {vehicules.map((vehicule) => (
                <li key={vehicule.id}>
                   <p>marque : {vehicule.marque} , modele : {vehicule.modele} , annee : {vehicule.annee}</p>
                   <div>
                   <button onClick={() => navigate(`/updateVehicule/${vehicule.id}`,
                   { state: { marque: vehicule.marque, modele: vehicule.modele, annee: vehicule.annee, client_id: vehicule.client_id } })}> Modifier ce véhicule </button>
                   <button onClick={() => fetchDeleteVehicules(vehicule.id)}> Supprimer ce véhicule </button>
                   </div>
                 
                </li>

              ))}
        </ul>
      </div>
    </div>
   
  );
};

export default AdminDashboard;
