import React, { useContext, useEffect, useState } from 'react';
import { MapContext } from '../contexts/MapContext';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import Draw from 'ol/interaction/Draw'; // <-- Draw interaction for drawing on map
import { GeoJSON } from 'ol/format'; // <-- GeoJSON to convert drawn shapes
import Navbar from './Navbar';
import "../styles/Navbar.css";

function MapComponent() {
  const {
    points,
    isUpdatePanelVisible,
    wkt,
    name,
    setWkt,
    setName,
    setIsUpdatePanelVisible,
    handleUpdateClick,
    handleManualUpdate,
    handlePanelUpdate,
    handleDelete,
  } = useContext(MapContext);

  const [map, setMap] = useState(null);
  const [lightLayer, setLightLayer] = useState(null);
  const [darkLayer, setDarkLayer] = useState(null);
  const [isNightMode, setIsNightMode] = useState(false);
  const [drawType, setDrawType] = useState('Point'); // <-- Default draw type is Point
  const [drawInteraction, setDrawInteraction] = useState(null);

  useEffect(() => {
    const light = new TileLayer({
      source: new OSM(),
    });
    setLightLayer(light);

    const dark = new TileLayer({
      source: new XYZ({
        url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      }),
    });
    setDarkLayer(dark);

    const newMap = new Map({
      target: 'map',
      layers: [light],
      view: new View({
        center: fromLonLat([35.0, 39.0]),
        zoom: 7,
      }),
    });

    setMap(newMap);

    return () => {
      newMap.setTarget(null);
    };
  }, []);

  const toggleMapMode = () => {
    if (!map) return;

    if (isNightMode) {
      map.removeLayer(darkLayer);
      map.addLayer(lightLayer);
    } else {
      map.removeLayer(lightLayer);
      map.addLayer(darkLayer);
    }
    setIsNightMode(!isNightMode);
  };

  const addDrawInteraction = (type) => {
    if (!map) return;

    if (drawInteraction) {
      map.removeInteraction(drawInteraction);
    }

    const newDrawInteraction = new Draw({
      source: new OSM(),
      type: type,
    });

    newDrawInteraction.on('drawend', (event) => {
      const format = new GeoJSON();
      const geometry = event.feature.getGeometry();
      const wktString = format.writeGeometry(geometry);
      setWkt(wktString);
      setIsUpdatePanelVisible(true);
    });

    map.addInteraction(newDrawInteraction);
    setDrawInteraction(newDrawInteraction);
  };

  const manualUpdateHandler = () => {
    setIsUpdatePanelVisible(false);
    enableModifyInteraction(); // Activate drag-and-drop interaction for manual update
  };

  const enableModifyInteraction = (id) => {
    // Add logic for enabling modify interaction
    // Using the ol/Modify interaction
    // On modify end, capture the new geometry in WKT and send an update request
  };

  const panelUpdateHandler = () => {
    setIsUpdatePanelVisible(false);
    // Send update via panel with WKT and name inputs
    handlePanelUpdate(); // Assuming this function sends the update request
  };

  const removeModifyInteraction = () => {
    // Implement the logic to remove modify interaction if active
  };

  return (
    <div>
      <Navbar
        toggleMapMode={toggleMapMode}
        isNightMode={isNightMode}
        setDrawType={setDrawType}
        addDrawInteraction={addDrawInteraction}
      />
      <div id="map" style={{ width: '100%', height: 'calc(100vh - 60px)' }}></div>

      {/* Update Panel */}
      {isUpdatePanelVisible && (
        <div id="updatePanel">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <input
            type="text"
            value={wkt}
            onChange={(e) => setWkt(e.target.value)}
            placeholder="WKT"
            readOnly
          />
          <button onClick={manualUpdateHandler}>Manual Update</button>
          <button onClick={panelUpdateHandler}>Update via Panel</button>
          <button onClick={() => setIsUpdatePanelVisible(false)}>Close</button>
        </div>
      )}

      {/* Marker List */}
      <div id="dataTable">
        {Array.isArray(points) &&
          points.map((point) => (
            <div key={point.id}>
              <span>{point.name}</span>
              <button onClick={() => handleUpdateClick(point.id)}>Update</button>
              <button onClick={() => handleDelete(point.id)}>Delete</button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default MapComponent;
