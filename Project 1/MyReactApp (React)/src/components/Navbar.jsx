import React, { useState, useContext } from 'react';
import "../styles/Navbar.css";
import { MapContext } from '../contexts/MapContext';

const Navbar = ({ toggleMapMode }) => {
  const [isDrawTypeVisible, setIsDrawTypeVisible] = useState(false);
  const { addDrawInteraction, setDrawType, fetchDataTable } = useContext(MapContext); // MapContext'ten fonksiyonlar

  const handleAddPointClick = () => {
    setIsDrawTypeVisible(!isDrawTypeVisible); // Çizim türü panelini aç/kapat
  };

  const handleDrawTypeSelection = (type) => {
    setDrawType(type); // Çizim türünü ayarla
    addDrawInteraction(type); // Haritada çizim etkileşimi başlat
    setIsDrawTypeVisible(false); // Paneli seçimin ardından kapat
  };

  const handleCloseDrawTypePanel = () => {
    setIsDrawTypeVisible(false); // Çizim türü panelini manuel olarak kapat
  };

  const handleQueryClick = () => {
    const dataTable = document.getElementById('dataTable');
    const isHidden = dataTable.classList.contains('hidden');
    if (isHidden) {
      dataTable.classList.remove('hidden');
      fetchDataTable(); // Verileri tabloya yükle
    } else {
      dataTable.classList.add('hidden');
    }
  };

  return (
    <header>
      <img
        src="https://www.basarsoft.com.tr/wp-content/uploads/2023/07/lk-amblem-3.png"
        className="logo"
        alt="Başarsoft Logo"
      />
      <nav>
        <button id="addPointBtn" onClick={handleAddPointClick}>
          Add Point
        </button>
        <button id="queryBtn" onClick={handleQueryClick}>
          Query
        </button>
        <button id="toggleModeBtn" onClick={toggleMapMode}>
          Toggle Night/Day Mode
        </button>
      </nav>

      {/* Çizim Türü Seçim Paneli */}
      {isDrawTypeVisible && (
        <div className="draw-type-panel">
          <h2>Select Drawing Type</h2>
          <button
            className="draw-type-btn"
            onClick={() => handleDrawTypeSelection('Point')}
          >
            Point
          </button>
          <button
            className="draw-type-btn"
            onClick={() => handleDrawTypeSelection('LineString')}
          >
            Line
          </button>
          <button
            className="draw-type-btn"
            onClick={() => handleDrawTypeSelection('Polygon')}
          >
            Polygon
          </button>
          <button className="close-btn" onClick={handleCloseDrawTypePanel}>
            Close
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
