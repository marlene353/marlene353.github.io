let stop = {
    nr: 5,
    name: "Oamaru",
    lat: -45.09746,
    lng: 170.96911,
    user: "marlene353",
    wikipedia: "https://de.wikipedia.org/wiki/Oamaru"
}

const map = L.map("map", {
    fullscreenControl: true,
    // center: [ stop.lat, stop.lng  ],
    // zoom: 13,
    layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    ]
});

//Objekt {} und Lsit & Array [] erstellt
let nav = document.querySelector("#navigation");
console.log(nav);


//console.log(ROUTE);
ROUTE.sort((stop1, stop2) => {
    if (stop1.nr > stop2.nr) {
        return 1;
    } else {
        return -1
    }
});

for (let entry of ROUTE) {
    //console.log(entry);

    nav.innerHTML += `<option value="${entry.user}">Stop ${entry.nr}: ${entry.name}</option> `;
    let mrk = L.marker([entry.lat, entry.lng]).addTo(map);
    mrk.bindPopup(`<h4>Stop ${entry.nr}: ${entry.name}</h4>
   <p><i class="fas fa-external-link-alt mr-3"></i><a href="${entry.wikipedia}">Read 
   about the stop in Wikipedia</a></p>
`);

    if (entry.nr == 5) {
        map.setView([entry.lat, entry.lng], 13);
        mrk.openPopup();
    }
}

nav.selectedIndex = 5 -1;
nav.onchange = (evt) => {
    console.log(evt.target.selectedIndex);
    let selected = evt.target.selectedIndex;
    let options = evt.target.options;

    let username = options[selected].value;
    let link = `https://${username}.github.io/nz/index.html`;
    window.location.href = link;
    console.log(link);
};

//<option value="webmapping">Oamaru</option>
//console.log(document.querySelector("#map"));


//miniMap + Minimize button + minimize
var miniMap = new L.Control.MiniMap(
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'), {
        toggleDisplay: true,
        minimized: true
    }
).addTo(map);