
import { useState, useEffect } from 'react';
import { useParams, useNavigate,useLocation } from 'react-router-dom';

const baseURI = import.meta.env.VITE_API_BASE_URL;

function UpdateVehicules() {
    const { state } = useLocation();
    
    useEffect(() => {
        if (state) {
            setVehicule({
                marque: state.marque,
                modele: state.modele,
                annee: state.annee,
                client_id: state.client_id
            });
        }
    }, [state]);
    const [vehicule, setVehicule] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();
   

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${baseURI}api/vehicules/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify(vehicule),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then((response) => {
            if(response.status === 200){
                navigate('/dashboard');
            } 
            if(response.status === 500) {
                alert('Erreur lors de la mise à jour du véhicule');
            }
        })
        .catch(error => console.error('Erreur:', error));
    }

    return (
        <div>
            <h1>Modifier le véhicule</h1>
            <form className="update-vehicule-form">
                <div className="form-group">
                    <label htmlFor="marque">Marque :</label>
                    <input type="text" id="marque" name="marque" required value={vehicule.marque || ''} onChange={(e) => setVehicule({ ...vehicule, marque: e.target.value })} />
                </div>
                <div className="form-group">
                    <label htmlFor="modele">Modèle :</label>
                    <input type="text" id="modele" name="modele" required value={vehicule.modele || ''} onChange={(e) => setVehicule({ ...vehicule, modele: e.target.value })} />
                </div>
                <div className="form-group">
                    <label htmlFor="annee">Année :</label>
                    <input type="number" id="annee" name="annee" required value={vehicule.annee || ''} onChange={(e) => setVehicule({ ...vehicule, annee: e.target.value })} />
                </div>
                <div className="form-group">
                    <label htmlFor="client_id">ID du client :</label>
                    <input type="number" id="client_id" name="client_id" value={vehicule.client_id || ''} onChange={(e) => setVehicule({ ...vehicule, client_id: e.target.value })} required />
                </div>
                <button type="submit" onClick={handleSubmit}>Mettre à jour le véhicule</button>
            </form>
        </div>
    );
}

export default UpdateVehicules;