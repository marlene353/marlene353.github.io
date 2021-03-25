const map = L.map("map", {
    center: [ -45.09746, 170.96911  ],
    zoom: 13,
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    ]
  });
  
  let mrk = L.marker([ -45.09746, 170.96911 ]).addTo(map);
  mrk.bindPopup('Oamaru');


  console.log(document.querySelector("#map"));