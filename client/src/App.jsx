import HomePage from './components/HomePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import AdminDashboard from './components/Dashboard';
import AddVehicule from './components/AddVehicules';
import UpdateVehicule from './components/UpdateVehicules';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/addVehicule" element={<AddVehicule />} />
          <Route path="/updateVehicule/:id" element={<UpdateVehicule />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;