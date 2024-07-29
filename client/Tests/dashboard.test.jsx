import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import Dashboard from '../src/components/Dashboard';
// Mock des modules et fonctions nécessaires
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('Dashboard', () => {
  beforeEach(() => {
    // Mock de localStorage
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => 'fake-token'),
      setItem: vi.fn(),
      removeItem: vi.fn()
    });

    // Mock de fetch
    vi.stubGlobal('fetch', vi.fn());
  });

  it('affiche le tableau de bord avec les clients', async () => {
    // Mock de la réponse fetch pour le chargement des clients
    fetch.mockResolvedValueOnce({
      ok : true,
      json: () => Promise.resolve({ clients: [{ id: 1, nom: 'Client Test' }] })
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Vérifier que le titre est affiché
    expect(screen.getByText('Tableau de bord')).toBeDefined();

    // Attendre que les clients soient chargés
    const clientElement = await screen.findByText('Client Test');
    expect(clientElement).toBeDefined();

    // Vérifier que le nombre de clients est affiché
    expect(screen.getByText('Nombre de clients : 1')).toBeDefined();
  });

/*  it('appelle handleDeleteClient lors du clic sur le bouton Supprimer', async () => {
    // Mock de la réponse fetch pour le chargement initial des clients
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ clients: [{ id: 1, nom: 'Client Test' }] })
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Attendre que le bouton Supprimer soit chargé
    const deleteButton = await screen.findByText('Supprimer');

    // Mock de la fonction fetch pour la suppression
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({})
    });

    // Cliquer sur le bouton Supprimer
    await fireEvent.click(deleteButton);

    // Vérifier que fetch a été appelé pour supprimer le client
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/dashboard/client/'), expect.any(Object));
  });*/
});