document.addEventListener('DOMContentLoaded', function () {
    const baseURL = 'https://localhost:7047/api/Point';
    let markerLayer = null;
    let drawInteraction = null;
    let modifyInteraction = null;
    let overlay = null;

    const lightLayer = new ol.layer.Tile({
        source: new ol.source.OSM()
    });

    const darkLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        })
    });

    const map = new ol.Map({
        target: 'map',
        layers: [lightLayer],
        view: new ol.View({
            center: ol.proj.fromLonLat([35.0, 39.0]),
            zoom: 7
        })
    });

    overlay = new ol.Overlay({
        element: document.getElementById('popup'),
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    });
    map.addOverlay(overlay);

    function toggleMapMode() {
        if (map.getLayers().getArray().includes(lightLayer)) {
            map.removeLayer(lightLayer);
            map.addLayer(darkLayer);
        } else {
            map.removeLayer(darkLayer);
            map.addLayer(lightLayer);
        }
        loadMarkers();
    }

    document.getElementById('toggleModeBtn').addEventListener('click', toggleMapMode);

    const savedMarkerStyle = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({ color: 'red' }),
            stroke: new ol.style.Stroke({
                color: 'white',
                width: 2
            })
        })
    });

    const lineStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'red',
            width: 2
        })
    });

    const polygonStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'red',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255, 0, 0, 0.3)'
        })
    });

    function loadMarkers() {
        fetch(baseURL)
            .then(response => response.json())
            .then(points => {
                if (markerLayer) {
                    map.removeLayer(markerLayer); 
                }
    
                const wktFormat = new ol.format.WKT(); // WKT formatı için parser
    
                const features = points.value.map(point => {
                    let feature;
                    
                    try {
                        feature = wktFormat.readFeature(point.wkt, {
                            dataProjection: 'EPSG:4326', // Verilerin projeksiyonu
                            featureProjection: map.getView().getProjection() // Harita projeksiyonu
                        });
    
                        feature.set('name', point.name); // Özellikle isim alanını ayarlayın
                        feature.set('id', point.id); // Özellikle id alanını ayarlayın
    
                        // Özellikle geometrilere göre stil ayarlama
                        if (feature.getGeometry().getType() === 'Point') {
                            feature.setStyle(savedMarkerStyle); // Nokta stili
                        } else if (feature.getGeometry().getType() === 'LineString') {
                            feature.setStyle(lineStyle); // LineString stili
                        } else if (feature.getGeometry().getType() === 'Polygon') {
                            feature.setStyle(polygonStyle); // Polygon stili
                        }
    
                    } catch (error) {
                        console.error('Error reading feature:', error);
                    }
    
                    return feature;
                });
    
                const vectorSource = new ol.source.Vector({
                    features: features
                });
    
                markerLayer = new ol.layer.Vector({
                    source: vectorSource
                });
    
                map.addLayer(markerLayer);
            })
            .catch(error => {
                console.error('Error loading markers:', error);
            });
    }
    
    // Load markers
    loadMarkers();

    const drawSource = new ol.source.Vector();
    const drawLayer = new ol.layer.Vector({
        source: drawSource
    });
    map.addLayer(drawLayer);

    const wktFormat = new ol.format.WKT();
    
    function formatWKT(geometry) {
        return wktFormat.writeGeometry(geometry);
    }

    document.getElementById('addPointBtn').addEventListener('click', function () {
        const drawTypePanel = document.getElementById('drawTypePanel');
        drawTypePanel.classList.remove('hidden');
    });
    
    document.getElementById('closeDrawTypePanelBtn').addEventListener('click', function () {
        const drawTypePanel = document.getElementById('drawTypePanel');
        drawTypePanel.classList.add('hidden');
    });
    
    document.querySelectorAll('.draw-type-btn').forEach(function (button) {
        button.addEventListener('click', function () {
            const drawType = this.getAttribute('data-type');
            const drawTypePanel = document.getElementById('drawTypePanel');
            drawTypePanel.classList.add('hidden');
    
            if (drawType) {
                if (drawInteraction) {
                    map.removeInteraction(drawInteraction);
                    drawInteraction = null;
                }
    
                drawInteraction = new ol.interaction.Draw({
                    source: markerLayer.getSource(),
                    type: drawType
                });
    
                map.addInteraction(drawInteraction);
    
                drawInteraction.on('drawend', function (event) {
                    const geometry = event.feature.getGeometry();
                    const wkt = formatWKT(geometry);
                    console.log('Drawn WKT:', wkt);
    
                    const infoPanel = document.getElementById('infoPanel');
                    const isHidden = infoPanel.classList.contains('hidden');
    
                    if (drawType === 'Point') {
                        const coords = geometry.getCoordinates();
                        const lonLat = ol.proj.toLonLat(coords);
                        const wktPoint = `POINT(${lonLat[0].toFixed(6)} ${lonLat[1].toFixed(6)})`;
                        document.getElementById('wktInput').value = wktPoint;
    
                        if (isHidden) {
                            infoPanel.classList.remove('hidden');
                        }
                    }
    
                    if (drawType === 'LineString') {
                        const coords = geometry.getCoordinates();
                        const lonLatCoords = coords.map(coord => {
                            const lonLat = ol.proj.toLonLat(coord);
                            return `${lonLat[0].toFixed(6)} ${lonLat[1].toFixed(6)}`;
                        });
                        const wktLineString = `LINESTRING(${lonLatCoords.join(', ')})`;
                        document.getElementById('wktInput').value = wktLineString;
    
                        if (isHidden) {
                            infoPanel.classList.remove('hidden');
                        }
                    }
    
                    if (drawType === 'Polygon') {
                        const coords = geometry.getCoordinates()[0];
                        const lonLatCoords = coords.map(coord => {
                            const lonLat = ol.proj.toLonLat(coord);
                            return `${lonLat[0].toFixed(6)} ${lonLat[1].toFixed(6)}`;
                        });
                        lonLatCoords.push(lonLatCoords[0]);
                        const wktPolygon = `POLYGON((${lonLatCoords.join(', ')}))`;
                        document.getElementById('wktInput').value = wktPolygon;
    
                        if (isHidden) {
                            infoPanel.classList.remove('hidden');
                        }
                    }
    
                    map.removeInteraction(drawInteraction);
                    drawInteraction = null;
                });
            }
        });
    });    

    function enableModifyInteraction() {
        if (modifyInteraction) {
            map.removeInteraction(modifyInteraction);
        }

        modifyInteraction = new ol.interaction.Modify({
            source: markerLayer.getSource()
        });

        map.addInteraction(modifyInteraction);

        modifyInteraction.on('modifyend', function (event) {
            const feature = event.features.item(0);
            const geometry = feature.getGeometry();
            const wkt = formatWKT(geometry);
            console.log('Modified WKT:', wkt);

            const id = feature.getId(); 
            sendWKTToBackend(wkt, id); 
        });
    }
    
    // Helper function to convert geometry to WKT format with lon/lat
    function toWKT(geometry) {
        const type = geometry.getType();
        const coords = geometry.getCoordinates();
        switch (type) {
            case 'Point':
                const [lon, lat] = ol.proj.toLonLat(coords);
                return `POINT (${lon.toFixed(6)} ${lat.toFixed(6)})`;
            case 'LineString':
                const lineCoords = coords.map(coord => {
                    const [lon, lat] = ol.proj.toLonLat(coord);
                    return `${lon.toFixed(6)} ${lat.toFixed(6)}`;
                });
                return `LINESTRING (${lineCoords.join(', ')})`;
            case 'Polygon':
                const rings = coords.map(ring => 
                    `(${ring.map(coord => {
                        const [lon, lat] = ol.proj.toLonLat(coord);
                        return `${lon.toFixed(6)} ${lat.toFixed(6)}`;
                    }).join(', ')})`
                );
                return `POLYGON (${rings.join(', ')})`;
            default:
                return '';
        }
    }
    
    map.on('singleclick', function (event) {
        map.forEachFeatureAtPixel(event.pixel, function (feature) {
            const geometry = feature.getGeometry();
            const coords = geometry.getCoordinates();
            const [lon, lat] = ol.proj.toLonLat(coords);
            const name = feature.get('name');
            const id = feature.get('id');
            const wkt = toWKT(geometry);  // Convert geometry to WKT format
        
            const popupContent = `
                <button onclick="closePopup()">Close</button>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>WKT:</strong> ${wkt}</p>
                <button onclick="updatePoint('${id}')">Update</button>
                <button onclick="showPoint('${wkt}')">Show</button>
                <button onclick="deletePoint('${id}')">Delete</button>
            `;
        
            const popupElement = document.getElementById('popup-content');
            popupElement.innerHTML = popupContent;
        
            // Position the overlay based on the click coordinate
            const overlayPosition = event.coordinate;
            overlay.setPosition(overlayPosition);
        });
    });    

    window.closePopup = function() {
        overlay.setPosition(undefined);
    };

    const wktInput = document.getElementById('wktInput');
    if (!wktInput) {
        console.error('WKT input element not found!');
        return;
    }

    document.getElementById('queryBtn').addEventListener('click', function () {
        const dataTable = document.getElementById('dataTable');
        const isHidden = dataTable.classList.contains('hidden');

        if (isHidden) {
            dataTable.classList.remove('hidden');
            fetchDataTable();
        } else {
            dataTable.classList.add('hidden');
        }
    });

    document.getElementById('savePointBtn').addEventListener('click', function () {
        var wkt = wktInput.value.trim(); // WKT değerini alırken boşlukları temizliyoruz
        var name = document.getElementById('pointName').value.trim(); // İsmi alırken de boşlukları temizliyoruz
    
        // Hatalı girişleri kontrol etme
        if (!wkt || !name) {
            alert('Both WKT and Name fields are required.');
            return; // Eksik bilgi varsa işlemden çık
        }
    
        // Backend API çağrısı için fetch kullanıyoruz
        fetch(baseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ wkt: wkt, name: name })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Yanıtı JSON formatına çeviriyoruz
        })
        .then(data => {
            console.log('Point added:', data);
            document.getElementById('infoPanel').classList.add('hidden'); // Bilgi panelini gizliyoruz
            loadMarkers(); // Haritadaki markerları yeniden yüklüyoruz
        })
        .catch(error => console.error('Error saving point:', error));
    });

    function fetchDataTable() {
        fetch(baseURL)
            .then(response => response.json())
            .then(points => {
                const wktFormat = new ol.format.WKT(); // WKT formatı için parser
    
                let tableContent = `
                <table id="pointsTable" class="display">
                    <thead>
                        <tr>
                            <th>Geometry</th>
                            <th>Name</th>
                            <th>Operations</th>
                        </tr>
                    </thead>
                    <tbody>`;
                
                points.value.forEach(point => {
                    let x = '';
                    let y = '';
     
                    try {
                        // WKT'yi çözümleyin ve koordinatları elde edin
                        const feature = wktFormat.readFeature(point.wkt, {
                            dataProjection: 'EPSG:4326', // Verilerin projeksiyonu
                            featureProjection: 'EPSG:3857' // Harita projeksiyonu
                        });
                        const geometry = feature.getGeometry();
                        
                        if (geometry.getType() === 'Point') {
                            const coords = geometry.getCoordinates();
                            [x, y] = ol.proj.toLonLat(coords); // Koordinatları dönüştür
                        }
                    } catch (error) {
                        console.error('Error parsing WKT:', error);
                    }
    
                    tableContent += `
                        <tr data-id="${point.id}">
                            <td>${point.wkt}</td>
                            <td>${point.name}</td>
                            <td>
                                <button onclick="showPoint('${point.wkt}')">Show</button>
                                <button onclick="updatePoint('${point.id}')">Update</button>
                                <button onclick="deletePoint('${point.id}')">Delete</button>
                            </td>
                        </tr>`;
                });
    
                tableContent += '</tbody></table>';
                document.getElementById('dataTable').innerHTML = tableContent;
                $('#pointsTable').DataTable();
            })
            .catch(error => console.error('Error fetching points:', error));
    }

    window.showPoint = function (wkt) {
        // Fonksiyonun tanımlandığı yer
        if (typeof map !== 'undefined' && map !== null) {
            const wktFormat = new ol.format.WKT();
    
            try {
                if (typeof wkt !== 'string') {
                    console.error('Invalid WKT data type:', typeof wkt);
                    return;
                }
                
                if (!wkt.trim()) {
                    console.error('WKT data is empty or invalid');
                    return;
                }
    
                const feature = wktFormat.readFeature(wkt, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                });
                const geometry = feature.getGeometry();
                
                if (!geometry) {
                    console.error('No geometry found in WKT');
                    return;
                }
    
                const geometryType = geometry.getType();
                const vectorSource = new ol.source.Vector({
                    features: [feature]
                });
    
                let style;
                if (geometryType === 'Point') {
                    const coords = geometry.getCoordinates();
                
                    // Koordinatları doğrudan kullanarak haritayı odaklayın
                    map.getView().animate({
                        center: coords, // Doğrudan koordinatları kullanın
                        duration: 1000,
                        zoom: 10
                    });
    
                    // Yeni bir işaretçi oluşturun
                    const marker = new ol.Feature({
                        geometry: new ol.geom.Point(coords)
                    });
    
                    const vectorSource = new ol.source.Vector({
                        features: [marker]
                    });
    
                    const markerLayer = new ol.layer.Vector({
                        source: vectorSource
                    });
    
                    markerLayer.getSource().getFeatures().forEach(feature => {
                        feature.setStyle(savedMarkerStyle);
                    });

                    style = new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 7,
                            fill: new ol.style.Fill({ color: 'red' }),
                            stroke: new ol.style.Stroke({
                                color: 'white',
                                width: 2
                            })
                        })
                    });
    
                    map.addLayer(markerLayer);
                    document.getElementById('dataTable').classList.add('hidden');
                } else if (geometryType === 'LineString') {
                    style = new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: 'red',
                            width: 2
                        })
                    });
                } else if (geometryType === 'Polygon') {
                    style = new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: 'red',
                            width: 2
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 0, 0, 0.3)'
                        })
                    });
                } else {
                    console.error('Unsupported geometry type:', geometryType);
                    return;
                }
    
                feature.setStyle(style);
    
                const markerLayer = new ol.layer.Vector({
                    source: vectorSource
                });
    
                map.getLayers().forEach(layer => {
                    if (layer instanceof ol.layer.Vector) {
                        map.removeLayer(layer);
                    }
                });
    
                map.addLayer(markerLayer);
    
                const coords = geometry.getCoordinates();
                const extent = geometry.getExtent();
                map.getView().fit(extent, { duration: 1000 });
    
                document.getElementById('dataTable').classList.add('hidden');
            } catch (error) {
                console.error('Error processing WKT:', error);
            }
        } else {
            console.error('Map object is not defined');
        }
    }

    let manualUpdateHandler = null;
    let panelUpdateHandler = null;

    window.updatePoint = function (id) {
        const updatePanel = document.getElementById('updatePanel');
        updatePanel.classList.remove('hidden');
        document.getElementById('dataTable').classList.add('hidden');
    
        const manualUpdateBtn = document.getElementById('manualUpdateBtn');
        const panelUpdateBtn = document.getElementById('panelUpdateBtn');
        const closeUpdatePanelBtn = document.getElementById('closeUpdatePanelBtn');

        panelUpdateBtn.dataset.id = id;

        closeUpdatePanelBtn.addEventListener('click', function () {
            updatePanel.classList.add('hidden');
            removeModifyInteraction();
        });
    
        if (!manualUpdateHandler) {
            manualUpdateHandler = function () {
                updatePanel.classList.add('hidden');
                enableModifyInteraction(id); // Harita üzerinde sürükleyip bırakma için etkileşimi etkinleştir
            };
            manualUpdateBtn.addEventListener('click', manualUpdateHandler);
        }

        if (!panelUpdateHandler) {
            panelUpdateHandler = function () {
                updatePanel.classList.add('hidden');
                removeModifyInteraction();
                
                const wktInput = document.getElementById('updateWktInput');
                const nameInput = document.getElementById('updateNameInput');
                const id = panelUpdateBtn.dataset.id; // ID'yi butonun data-id özelliğinden al

                if (wktInput && nameInput) {
                    const wkt = wktInput.value;
                    const name = nameInput.value;

                    console.log('Sending Update Request with:', { id, wkt, name });
        
                    // Backend'e güncelleme isteği gönder
                    fetch(`${baseURL}/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: id, wkt: wkt, name: name })
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Point updated:', data);
                        loadMarkers(); // Haritadaki markerları yeniden yükle
                    })
                    .catch(error => console.error('Error updating point:', error));
                } else {
                    console.error('Error: Update WKT input not found');
                }
            };
            panelUpdateBtn.addEventListener('click', panelUpdateHandler);
        }
    };

    function enableModifyInteraction(id) {
        if (modifyInteraction) {
            map.removeInteraction(modifyInteraction);
        }
    
        modifyInteraction = new ol.interaction.Modify({
            source: markerLayer.getSource()
        });
    
        map.addInteraction(modifyInteraction);
    
        modifyInteraction.on('modifyend', function (event) {
            const feature = event.features.item(0);
            const geometry = feature.getGeometry();
            const geometryType = geometry.getType(); // Geometry type (Point, LineString, Polygon)
            let wkt = '';
    
            // Farklı geometri türlerine göre WKT oluşturma
            if (geometryType === 'Point') {
                const coords = ol.proj.toLonLat(geometry.getCoordinates());
                wkt = `POINT(${coords[0]} ${coords[1]})`;
            } else if (geometryType === 'LineString') {
                const coordsArray = geometry.getCoordinates().map(coord => {
                    const [lon, lat] = ol.proj.toLonLat(coord);
                    return `${lon} ${lat}`;
                }).join(', ');
                wkt = `LINESTRING(${coordsArray})`;
            } else if (geometryType === 'Polygon') {
                const rings = geometry.getCoordinates().map(ring => {
                    const coordsArray = ring.map(coord => {
                        const [lon, lat] = ol.proj.toLonLat(coord);
                        return `${lon} ${lat}`;
                    }).join(', ');
                    return `(${coordsArray})`;
                }).join(', ');
                wkt = `POLYGON(${rings})`;
            }
    
            // PUT isteği ile güncelleme
            fetch(`${baseURL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id, wkt: wkt, name: feature.get('name') })
            }).then(response => response.json())
                .then(data => {
                    if (data.status) {
                        console.log('Point updated:', data);
                        loadMarkers();
                    } else {
                        console.error('Error:', data.message);
                    }
                    removeModifyInteraction();
                }).catch(error => console.error('Error updating point:', error));
        });
    }    

    function removeModifyInteraction() {
        if (modifyInteraction) {
            map.removeInteraction(modifyInteraction);
            modifyInteraction = null;
        }
    }
    
    window.getFeatures = function () {
        return markerLayer.getSource().getFeatures();
    };

    window.deletePoint = function (id) {
        if (!id) {
            console.error('No ID provided for deletion');
            return;
        }
        
        fetch(`${baseURL}/${id}`, {
            method: 'DELETE'
        }).then(response => response.json())
            .then(data => {
                if (data.status) {
                    console.log('Point deleted:', data);
                    loadMarkers();
                } else {
                    console.error('Error:', data.message);
                }
            }).catch(error => console.error('Error deleting point:', error));
    }
});
