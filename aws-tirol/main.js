let basemapGray = L.tileLayer.provider('BasemapAT.grau');

//https://leafletjs.com/reference-1.7.1.html#map-example
let map = L.map("map", {
    center: [47, 11],
    zoom: 9,
    layers: [
        basemapGray
    ]
});

//https://leafletjs.com/reference-1.7.1.html#control
let layerControl = L.control.layers({
    "BasemapAT.grau": basemapGray,
    //https://leafletjs.com/reference-1.7.1.html#tilelayer
    "BasemapAT.orthofoto": L.tileLayer.provider('BasemapAT.orthofoto'),
    "BasemapAT.surface": L.tileLayer.provider('BasemapAT.surface'),
    //https://leafletjs.com/reference-1.7.1.html#layergroup
    "BasemapAT.overlay+ortho": L.layerGroup([
        L.tileLayer.provider('BasemapAT.orthofoto'),
        L.tileLayer.provider('BasemapAT.overlay')
    ])
}).addTo(map);


let awsUrl = 'https://wiski.tirol.gv.at/lawine/produkte/ogd.geojson';


//thematische layer
// awsLayer.addTo(map);
let awsLayer = L.featureGroup(); 
//https://leafletjs.com/reference-1.7.1.html#featuregroup
layerControl.addOverlay(awsLayer, "Wetterstationen Tirol");

// snowLayer.addTo(map);
let snowLayer = L.featureGroup();
layerControl.addOverlay(snowLayer, "Schneehöhen (cm)");

//windLayer.addTo(map);
let windLayer = L.featureGroup();
layerControl.addOverlay(windLayer, "Windgeschwindigkeit (km/h)");
// windlayer dann bei laden angezeigt, rest auswählbar außer durch addtomap hinzugefügt

//tempLayer.addTo(map); Layer hinzufügen nicht vergessen!!!
let tempLayer = L.featureGroup();
layerControl.addOverlay(tempLayer, "Lufttemperatur °C");
tempLayer.addTo(map);


fetch(awsUrl)
    .then(response => response.json())
    .then(json => {
            console.log('Daten konvertiert: ', json);
            //Stationen
            for (station of json.features) {
                // console.log('Station: ', station);
                //https://leafletjs.com/reference-1.7.1.html#marker
                let marker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ]);
                let formattedDate = new Date(station.properties.date);
                marker.bindPopup(`
            <h3>${station.properties.name}</h3>
            <ul>
              <li>Datum: ${formattedDate.toLocaleString("de")}</li>
              <li>Seehöhe: ${station.geometry.coordinates[2]} m</li>
              <li>Temperatur: ${station.properties.LT} C</li>
              <li>Schneehöhe: ${station.properties.HS || '?'} cm</li>
              <li>Windgeschwindigkeit: ${station.properties.WG || '?'} km/h</li>
              <li>Windrichtung: ${station.properties.WR || '?'}</li>
            </ul>
            <a target="_blank" href="https://wiski.tirol.gv.at/lawine/grafiken/1100/standard/tag/${station.properties.plot}.png">Grafik</a>
            `);
                marker.addTo(awsLayer);
                if (station.properties.HS) {
                    let highlightClass = '';
                    if (station.properties.HS > 100) {
                        highlightClass = 'snow-100';
                    }
                    if (station.properties.HS > 200) {
                        highlightClass = 'snow-200';
                    }
                    let snowIcon = L.divIcon({
                        //https://leafletjs.com/reference-1.7.1.html#divicon
                        html: `<div class="snow-label ${highlightClass}">${station.properties.HS}</div>`
                    })
                    let snowMarker = L.marker([
                        station.geometry.coordinates[1],
                        station.geometry.coordinates[0]
                    ], {
                        icon: snowIcon
                    });
                    snowMarker.addTo(snowLayer);
                }
                if (station.properties.WG) {
                    let windHighlightClass = '';
                    if (station.properties.WG > 10) {
                        windHighlightClass = 'wind-10';
                    }
                    if (station.properties.WG > 20) {
                        windHighlightClass = 'wind-20';
                    }
                    let windIcon = L.divIcon({
                        html: `<div class="wind-label ${windHighlightClass}">${station.properties.WG}</div>`,
                    });
                    let windMarker = L.marker([
                        station.geometry.coordinates[1],
                        station.geometry.coordinates[0]
                    ], {
                        icon: windIcon
                    });
                    windMarker.addTo(windLayer);
                }

                if (station.properties.LT) {
                    let tempHighlightClass = '';
                    if (station.properties.LT > 0) {
                        tempHighlightClass = 'temp-pos';
                    }
                    if (station.properties.LT < 0) {
                        tempHighlightClass = 'temp-neg';
                    }
                    let tempIcon = L.divIcon({
                        html: `<div class="temp-label ${tempHighlightClass}">${station.properties.LT}</div>`,
                    });
                    let tempMarker = L.marker([
                        station.geometry.coordinates[1],
                        station.geometry.coordinates[0]
                    ], {
                        icon: tempIcon
                    });
                    tempMarker.addTo(tempLayer);
                }
                if (station.properties.LT == 0) {
                    let tempHighlightClass = 'temp-0';
                    let tempIcon = L.divIcon({
                        html: `<div class="temp-label ${tempHighlightClass}">${station.properties.LT}</div>`,
                    });
                    let tempMarker = L.marker([
                        station.geometry.coordinates[1],
                        station.geometry.coordinates[0]
                    ], {
                        icon: tempIcon
                    });
                    tempMarker.addTo(tempLayer);
                }
            } 
                // nachfragen was zur Hölle nochmal HighlightClass außer nicht passend weil dumme Frage 

                //LT if (station.properties.LT == 0)... Lufttemperatur von 0 hinzufügen, weil oben nur alles außer 0 hinzugefügt

                // set map view to all stations
                map.fitBounds(awsLayer.getBounds());
            });