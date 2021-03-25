
let stop = {
    nr: 5,
    lat:-45.09746,
    lng: 170.96911,
    user: "marlene353",
    wikipedia: "https://de.wikipedia.org/wiki/Oamaru"
}

console.log(stop);
console.log(stop.name);
console.log(stop.lat);
console.log(stop.wikipedia);

const map = L.map("map", {
    center: [ stop.lat, stop.lng  ],
    zoom: 13,
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    ]
  });
  
  let mrk = L.marker([ -45.09746, 170.96911 ]).addTo(map);
  mrk.bindPopup(`<h4>Stop ${stop.5}: ${stop.Oamaru}<h4>
<p><a href="${stop.wikipedia}"><i class="fas fa-external-link-alt mr-3"></i>Read about stop in Wikipedia</a></p>
`).openPopup();

console.log(document.querySelector("#map"));