
let stop = {
    nr: 5,
    name: "Oamaru",
    lat:-45.09746,
    lng: 170.96911,
    user: "marlene353",
    wikipedia: "https://de.wikipedia.org/wiki/Oamaru"
};

console.log(stop.name);

const map = L.map("map", {
   // center: [ stop.lat, stop.lng  ],
    // zoom: 13,
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    ]
  });
  
  let nav = document.querySelector("#navigation");
  console.log (nav);


  //console.log(ROUTE);
  ROUTE.sort ((stop1,stop2)=> {
      return stop1.nr > stop2.nr
  });

 for (let entry of ROUTE) {
  //console.log(entry);

  nav.innerHTML += `
  <option value="${entry.user}">Stop ${entry.nr}: ${entry.name}</option>
  `;
  
  let mrk = L.marker([entry.lat, entry.lng]).addTo(map);
  mrk.bindPopup(`
   <h4>Stop ${entry.nr}: ${entry.name}<h4>
   <p><i class="fas fa-external-link-alt mr-3"></i><a href="${entry.wikipedia}">Read 
   about stop in Wikipedia</a></p>
`);

if(entry.nr==5) {
    map.setView([entry.lat, entry.lng], 5)  
    mrk.openPopup ();
    }
}

nav.onchange = (evt) => {
    console.log(evt.target.selectedIndex);
    let selected = evt.target.selectedIndex;
    let options = evt.target.options;
    let username = options[selected].value;
    let link = `https://${username}.github.io/nz/index.html`;
    console.log(username, link);

    window.location.href = link;
};

//<option value="webmapping">Oamaru</option>
//console.log(document.querySelector("#map"));