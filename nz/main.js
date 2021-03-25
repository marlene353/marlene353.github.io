const map = L.map("map", {
    center: [ -39.29, 175.56  ],
    zoom: 13,
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    ]
  });
  
  let mrk = L.marker([ -39.29, 175.56 ]).addTo(map);
  mrk.bindPopup('Tongariro National Park');


  console.log(document.querySelector("#map"));