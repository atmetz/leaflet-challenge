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

}
  


function createMarkers(response) {
    
  // create earthquakes to hold the features
  let earthquakes = response.features;
  let eqMarkers = [];

  // for loop to read each earthquake and get coordinates
  for (i = 0; i < earthquakes.length; i++) {

    let earthquake = earthquakes[i].geometry;

    // add each earthquake to list holding all the earthquake coordinates
    let eqMarker = L.marker([earthquake.coordinates[1], earthquake.coordinates[0]]);
      // .bindPop("<h3>" + earthquake.properites.place + "</h3>");

    eqMarkers.push(eqMarker);

  };

  // call createMap function to create the map
  createMap(L.layerGroup(eqMarkers));

}

// set URL for all earthquakes in the last week
let earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// get geojson for all the earthquakes in the last week
d3.json(earthquakeURL).then(createMarkers);