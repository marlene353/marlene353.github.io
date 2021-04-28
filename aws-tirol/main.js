let basemapGray = L.tileLayer.provider('BasemapAT.grau');

let map = L.map("map", {
    center: [47, 11],
    zoom: 9,
    layers: [
        basemapGray
    ]
});

let overlays = {
    stations:L.featureGroup(), 
    temperature: L.featureGroup(),
    snowheight: L.featureGroup(),
    windspeed: L.featureGroup(),
    winddirection: L.featureGroup(),
    humidity: L.featureGroup()
}; 

let layerControl = L.control.layers({
    "BasemapAT.grau": basemapGray,
    "BasemapAT.orthofoto": L.tileLayer.provider('BasemapAT.orthofoto'),
    "BasemapAT.surface": L.tileLayer.provider('BasemapAT.surface'),
    "BasemapAT.overlay+ortho": L.layerGroup([
        L.tileLayer.provider('BasemapAT.orthofoto'),
        L.tileLayer.provider('BasemapAT.overlay')
    ])
}, {
    "Wetterstationen Tirol": overlays.stations,
    "Temperatur (°C)": overlays.temperature,
    "Schneehöhe (cm)": overlays.snowheight,
    "Windgeschwindigkeit (km/h)": overlays.windspeed,
    "Windrichtung": overlays.winddirection,
    "Relative Luftfeuchtigkeit": overlays.humidity,
}, {
    collapsed:false 
}).addTo(map);
overlays.temperature.addTo(map);

L.control.scale({
    imperial: false
}).addTo(map);

let getColor = (value, colorRamp) => {
    for(let rule of colorRamp) {
        if(value >= rule.min && value < rule.max) {
            return rule.col;
        }
    }
    return "black";
};

///let getDirection = (value, directionRamp) => {
    //for( let rule of directionRamp) {
        //if(value >= rule.min && value < rule.max) {
            //return rule.dir;
        }
    }
}

let newLabel = (coords, options) => {
    let color = getColor(options.value, options.colors);
   let label = L.divIcon({
    html: `<div style="background-color:${color}">${options.value}</div>`,
       className: "text-label"
   })
    let marker = L.marker([coords[1],coords[0]], {
       icon:label,
       title: `${options.station} (${coords[2]}m)`
   });
 return marker;
};

let awsUrl = 'https://wiski.tirol.gv.at/lawine/produkte/ogd.geojson';
fetch(awsUrl)
    .then(response => response.json())
    .then(json => {
            console.log('Daten konvertiert: ', json);
            for (station of json.features) {
                let marker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ]);
                let formattedDate = new Date(station.properties.date);
                //let direction = getDirection (station.properties.WR, DIRECTIONS);
                marker.bindPopup(`
            <h3>${station.properties.name}</h3>
            <ul>
              <li>Datum: ${formattedDate.toLocaleString("de")}</li>
              <li>Seehöhe: ${station.geometry.coordinates[2]} m</li>
              <li>Temperatur: ${station.properties.LT} C</li>
              <li>Schneehöhe: ${station.properties.HS || '?'} cm</li>
              <li>Windgeschwindigkeit: ${station.properties.WG || '?'} km/h</li>
              <li>Windrichtung: ${direction || '?'}</li>
              <li>Relative Luftfeuchtigkeit: ${station.properties.RH || '?'}</li>
            </ul>
            <a target="_blank" href="https://wiski.tirol.gv.at/lawine/grafiken/1100/standard/tag/${station.properties.plot}.png">Grafik</a>
            `);
                marker.addTo(overlays.stations);
               
                //Schneehöhe
                if (typeof station.properties.HS == "number") {
                    let marker  = newLabel(station.geometry.coordinates, {
                        value: station.properties.HS.toFixed (0),
                        colors: COLORS.snowheight,
                        station: station.properties.name
                    });
                    marker.addTo (overlays.snowheight);
                }
                //Windgeschwindigkeit
                if (typeof station.properties.WG == "number") {
                    let marker  = newLabel(station.geometry.coordinates, {
                        value:station.properties.WG.toFixed(0),
                        colors: COLORS.windspeed,
                        station:station.properties.name
                    });
                    marker.addTo (overlays.windspeed);
                }
                //Temperatur
                if (typeof station.properties.LT == "number") {
                    let marker  = newLabel(station.geometry.coordinates, {
                        value:station.properties.LT.toFixed(1),
                        colors: COLORS.temperature,
                        station: station.properties.name
                    });
                    marker.addTo (overlays.temperature);
                }  
                //Luftfeuchtigkeit
                if (typeof station.properties.RH == "number") {
                    let marker  = newLabel(station.geometry.coordinates, {
                        value:station.properties.RH.toFixed(1),
                        colors: COLORS.humidity,
                        station: station.properties.name
                    });
                    marker.addTo (overlays.temperature);
             } 
                map.fitBounds(overlays.stations.getBounds());
            });

            
    