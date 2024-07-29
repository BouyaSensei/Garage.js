import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import './styles.css';

const baseURI = import.meta.env.VITE_API_BASE_URL;
function AddVehicules() {
    const navigate = useNavigate();
    const [vehicule, setVehicules] = useState([]);
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        // Récupérer le token CSRF du serveur
        fetch(`${baseURI}api/csrf-token`, {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => setCsrfToken(data.csrfToken))
        .catch(error => console.error('Erreur lors de la récupération du token CSRF:', error));

     
    }, [vehicule]);

    const handleSubmit = (e) => {
        e.preventDefault();
    
        console.log(vehicule);
        fetch(`${baseURI}api/vehicules/add`, {
            method: 'POST',
            body: JSON.stringify(vehicule),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            },
            credentials: 'include'
        })
        .then((response) => {
            if(response.status == 201){
                navigate('/dashboard')
            }
            if(response.status == 500){
                alert('Erreur lors de l\'ajout du véhicule');
            }
        })
    }

    return (
        <div>
            <h1>Ajouter un véhicule</h1>

            <form className="add-vehicule-form">
                <input type="hidden" name="_csrf" value={csrfToken} />
                <div className="form-group">
                    <label htmlFor="marque">Marque :</label>
                    <input type="text" id="marque" name="marque" required value={vehicule.marque} onChange={(e) => setVehicules({ ...vehicule, marque: e.target.value,client_id:4 })} />
                </div>
                <div className="form-group">
                    <label htmlFor="modele">Modèle :</label>
                    <input type="text" id="modele" name="modele" required value={vehicule.modele} onChange={(e) => setVehicules({ ...vehicule, modele: e.target.value,client_id:4 })} />
                </div>
                <div className="form-group">
                    <label htmlFor="annee">Année :</label>
                    <input type="number" id="annee" name="annee" required value={vehicule.annee} onChange={(e) => setVehicules({ ...vehicule, annee: e.target.value,client_id:4 })} />
                </div>
                <div className="form-group" style={{ display: 'none' }}>
                    <label htmlFor="client_id">ID du client :</label>
                    <input type="hidden" id="client_id" name="client_id" value='4' onChange={(e) => setVehicules({ ...vehicule, client_id: e.target.value })} required disabled />
                </div>
            
                <button type="submit" onClick={handleSubmit}>Ajouter le véhicule</button>
            </form>
        </div>
    );
}
//        {vehicule.client_id}
export default AddVehicules;