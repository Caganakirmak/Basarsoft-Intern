import React, { createContext, useState, useEffect } from 'react';

export const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [points, setPoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [isUpdatePanelVisible, setIsUpdatePanelVisible] = useState(false);
  const [wkt, setWkt] = useState('');
  const [name, setName] = useState('');

  const baseURL = 'https://localhost:7047/api/Point';

  useEffect(() => {
    loadMarkers();
  }, []);

  const loadMarkers = () => {
    fetch(`${baseURL}`)
      .then(response => response.json())
      .then(data => setPoints(data))
      .catch(error => console.error('Error loading markers:', error));
  };

  const handleUpdateClick = (id) => {
    setSelectedPoint(id);
    setIsUpdatePanelVisible(true);
  };

  const handleManualUpdate = () => {
    setIsUpdatePanelVisible(false);
    enableModifyInteraction(selectedPoint);
  };

  const handlePanelUpdate = () => {
    fetch(`${baseURL}/${selectedPoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedPoint, wkt, name })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Point updated:', data);
        loadMarkers();
        setIsUpdatePanelVisible(false);
      })
      .catch(error => console.error('Error updating point:', error));
  };

  const enableModifyInteraction = (id) => {
    // Harita ile etkileşim
  };

  const handleDelete = (id) => {
    fetch(`${baseURL}/${id}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        console.log('Point deleted:', data);
        loadMarkers();
      })
      .catch(error => console.error('Error deleting point:', error));
  };

  const setDrawType = (type) => {
    console.log(`Drawing type set to: ${type}`);
    // Harita üzerinde ilgili türde çizim yapabilmek için etkileşim eklenir.
  };

  const addDrawInteraction = (type) => {
    console.log(`Starting draw interaction for: ${type}`);
    // Haritada çizim etkileşimi başlatma
  };

  const fetchDataTable = () => {
    console.log('Fetching data for table display');
    // Query işlemleri için backend'den verileri çek
  };

  return (
    <MapContext.Provider value={{
      points,
      selectedPoint,
      isUpdatePanelVisible,
      wkt,
      name,
      setWkt,
      setName,
      handleUpdateClick,
      handleManualUpdate,
      handlePanelUpdate,
      handleDelete,
      setDrawType,
      addDrawInteraction,
      fetchDataTable,
    }}>
      {children}
    </MapContext.Provider>
  );
};
