
let stop = {
    nr: 5,
    lat:-45.09746,
    lng: 170.96911,
    user: "marlene353",
    wikipedia: "https://de.wikipedia.org/wiki/Oamaru"
};

const map = L.map("map", {
    center: [ stop.lat, stop.lng  ],
    zoom: 13,
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    ]
  });
  
  let nav = document.querySelector("#navigation");
  console.log (nav);


  //console.log(ROUTE);
  ROUTE.sort ((stop1,stop2)=> {
      return stop1nr. > stop2.nr
  });

 for (let entry of ROUTE) {
  //console.log(entry);

  nav.innerHTML +=   nav.innerHTML += `
  <option value="${entry.user}">Stop ${entry.nr}: ${entry.name}</option>
  `;
  


  let mrk = L.marker([entry.lat, entry.lng]).addTo(map);
  mrk.bindPopup(`
   <h4>Stop ${entry.nr}: ${entry.name}<h4>
   <p><i class="fas fa-external-link-alt mr-3"></i><a href="${entry.wikipedia}">Read 
   about stop in Wikipedia</a></p>
`);

if(entry.nr=5) {
    map.setView([entry.lat, entry.lng], 13)  
    mrk.openPopup ();
    }
}


//<option value="webmapping">Oamaru</option>
//console.log(document.querySelector("#map"));