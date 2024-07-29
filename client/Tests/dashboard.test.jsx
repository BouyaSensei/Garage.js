import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../src/components/Dashboard';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('Dashboard', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => 'fake-token'),
      setItem: vi.fn(),
      removeItem: vi.fn()
    });

    vi.stubGlobal('fetch', vi.fn());
  });

  it('charge et affiche les véhicules', async () => {
    const mockVehicules = [
      { id: 1, marque: 'Tesla', modele: 'Model 3', annee: '1990', id_client: 4 },
      { id: 2, marque: 'Renault', modele: 'Zoe', annee: '2000', id_client: 4 }
    ];

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ vehicules: mockVehicules })
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    console.log(screen.debug());

    await vi.waitFor(() => {
      const vehiculeElements = screen.getAllByRole('listitem');
      expect(vehiculeElements.length).toBe(2);
    });

    const vehiculeElements = screen.getAllByRole('listitem');
    
    const teslaElement = vehiculeElements.find(element => 
      element.textContent.includes('Tesla') && element.textContent.includes('Model 3')
    );
    expect(teslaElement).toBeTruthy();

    const renaultElement = vehiculeElements.find(element => 
      element.textContent.includes('Renault') && element.textContent.includes('Zoe')
    );
    expect(renaultElement).toBeTruthy();
  });

  it('permet d\'ajouter un nouveau véhicule', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ vehicules: [] })
    });

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Véhicule ajouté avec succès' })
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    console.log(screen.debug());

    const addButton = await screen.findByText(/Ajouter un véhicule/i);
    fireEvent.click(addButton);

    // Simuler la navigation vers la page d'ajout de véhicule
    // Notez que cela peut nécessiter des ajustements en fonction de votre implémentation
    render(
      <BrowserRouter>
        <AddVehicule />
      </BrowserRouter>
    );

    console.log(screen.debug());

    const marqueInput = screen.getByLabelText(/Marque/i);
    const modeleInput = screen.getByLabelText(/Modèle/i);
    const submitButton = screen.getByText(/Ajouter le véhicule/i);

    fireEvent.change(marqueInput, { target: { value: 'Peugeot' } });
    fireEvent.change(modeleInput, { target: { value: '208' } });
    fireEvent.click(submitButton);

    const successMessage = await screen.findByText(/Véhicule ajouté avec succès/i);
    expect(successMessage).toBeTruthy();
  });

  it('permet de supprimer un véhicule', async () => {
    const mockVehicules = [
      { id: 1, marque: 'Tesla', modele: 'Model 3', annee: '1990', id_client: 4 }
    ];

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ vehicules: mockVehicules })
    });

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Véhicule supprimé avec succès' })
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    console.log(screen.debug());

    await vi.waitFor(() => {
      const vehiculeElements = screen.getAllByRole('listitem');
      expect(vehiculeElements.length).toBe(1);
    });

    const vehiculeElements = screen.getAllByRole('listitem');
    const teslaElement = vehiculeElements.find(element => 
      element.textContent.includes('Tesla') && element.textContent.includes('Model 3')
    );
    expect(teslaElement).toBeTruthy();

    const deleteButton = within(teslaElement).getByText(/Supprimer ce véhicule/i);
    fireEvent.click(deleteButton);

    const successMessage = await screen.findByText(/Véhicule supprimé avec succès/i);
    expect(successMessage).toBeTruthy();
  });
});