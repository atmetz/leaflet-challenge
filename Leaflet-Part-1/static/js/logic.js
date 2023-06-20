function createMap(eqLocations) {

  // Adding a tile layer (the background map image) to our map:
  // We use the addTo() method to add objects to our map.
  let worldMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Sets Base Maps to World Map
  let baseMaps = {
    "World Map": worldMap
  };
  
  // Create overlay maps to show earthquake locations
  let ovelayMaps = {
    "Earthquakes": eqLocations
  };

  // create myMap to show the world map and earthquake locations
  let myMap = L.map("map", {
    center: [39.8, -112.51],
    zoom: 5,
    layers: [worldMap, eqLocations]
  });

  // Set the map control to toggle on and off the earthquake locations
  L.control.layers(baseMaps, ovelayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({postion: 'bottomright'});

  legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
  
      return div;
  }

  legend.addTo(myMap);

}

function createMarkers(response) {
    
  // create earthquakes to hold the features
  let earthquakes = response.features;
  let eqMarkers = [];

  // for loop to read each earthquake and get coordinates
  for (i = 0; i < earthquakes.length; i++) { 

    let earthquake = earthquakes[i];

    let eqColor = getColor(earthquake.geometry.coordinates[2]);

    // add each earthquake to list holding all the earthquake coordinates

    let eqMarker = L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]],{
      color: "black",
      fillColor: eqColor,
      weight: 1,
      fillOpacity: 0.75,
      radius: earthquake.properties.mag * 10000
    }).bindPopup("<h3> Location: " + earthquake.properties.place + 
                "</h3><h3>Mag: " + earthquake.properties.mag + 
                "</h3><h3>Depth: " + earthquake.geometry.coordinates[2] + 
                "</h3><a href=" + earthquake.properties.url + ">URL</a>");

    eqMarkers.push(eqMarker);

  };

  // call createMap function to create the map
  createMap(L.layerGroup(eqMarkers));

}

function getColor(color){
  return color > 90 ? "red" :
         color > 70 ? "pink" :
         color > 50 ? "orange" :
         color > 30 ? "yellow" :
         color > 10 ? "lightgreen" :
                      "green";
}

// set URL for all earthquakes in the last week
let earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// get geojson for all the earthquakes in the last week
d3.json(earthquakeURL).then(createMarkers);