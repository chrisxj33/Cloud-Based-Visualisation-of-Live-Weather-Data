// Create the map object and set the initial view and zoom level
const map = L.map('map').setView([-37.0201, 144.9646], 8); // Map centered at [-37.0201, 144.9646] with a zoom level of 8

// Add the OpenStreetMap layer to the map
// Add the OpenStreetMap layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | ' +
                 'Grid cells by <a href="https://eng.uber.com/h3/">Uber H3</a> | ' +
                 'Temperature data by <a href="https://open-meteo.com/">Open-Meteo</a> | ' +
                 'Work by Chris Johnson is licensed under a <a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>'
}).addTo(map);

// Variables for cycle layers functionality
let visibleLayerIndex = 0; // Variable to keep track of the current visible layer
const layers = []; // Array to store the fetched layers

// Temperature to color mapping
const temperatureColors = {
    '<-20': '#0000FF',  // Deep freeze
    '-20-0': '#0066FF', // Very cold
    '0-5': '#3399FF',   // Cold
    '5-10': '#99CCFF',  // Cool
    '10-15': '#ADD8E6', // Mild
    '15-20': '#FFFF99', // Warm
    '20-25': '#FFCC66', // Hot
    '25-30': '#FF9900', // Very hot
    '30+': '#FF0000'    // Scorching
};

// Function to return the appropriate color based on the temperature
function getTemperatureColor(temp) {
    if (temp < -20) {
        return temperatureColors['<-20'];
    } else if (temp < 0) {
        return temperatureColors['-20-0'];
    } else if (temp < 5) {
        return temperatureColors['0-5'];
    } else if (temp < 10) {
        return temperatureColors['5-10'];
    } else if (temp < 15) {
        return temperatureColors['10-15'];
    } else if (temp < 20) {
        return temperatureColors['15-20'];
    } else if (temp < 25) {
        return temperatureColors['20-25'];
    } else if (temp < 30) {
        return temperatureColors['25-30'];
    } else {
        return temperatureColors['30+'];
    }
}

// Add click event listener to the cycle layers button
document.getElementById('cycleLayers').addEventListener('click', function () {
    
    // Remove the current visible layer from the map
    map.removeLayer(layers[visibleLayerIndex]);

    // Update the visible layer index
    visibleLayerIndex = (visibleLayerIndex + 1) % layers.length;

    // Add the next layer in the sequence to the map
    layers[visibleLayerIndex].addTo(map);
});

// GeoServer WFS URL
const geoserverWfsUrl = 'https://CloudProject-bteyanhheyg3adba.z01.azurefd.net/geoserver/cloudbased_project/ows';

// Function: make request to for GeoJSON layer from GeoServer
function fetchGeoJsonLayer(layerName) {
    return fetch(`${geoserverWfsUrl}?service=WFS&version=1.0.0&request=GetFeature&typeName=cloudbased_project:${layerName}&outputFormat=application/json`)
        .then(response => response.json());
}

// Function: Define list of layers to be fetched and added
// Adds all required functionality such as click listener to every layer listed
function fetchAndAddLayers(layerNames) {
    
    // Fetch all the GeoJSON layers from GeoServer
    const layerPromises = layerNames.map(layerName => fetchGeoJsonLayer(layerName));

    // Wait for all layers to be fetched
    Promise.all(layerPromises)
        .then(geojsonLayers => {
            
            // Iterate through the fetched layers and add them to the map
            // Also add all defined functions below to each layer       
            geojsonLayers.forEach((geojsonLayer, index) => {
                
                // Create the GeoJSON layer with click listener for each feature and colour style
                const layer = L.geoJSON(geojsonLayer, {
                    style: function (feature) {
                        return { 
                            colour: getTemperatureColor(feature.properties.temperature),
                            weight: 1, // Set line width
                            opacity: 0.2,
                            fillColor: getTemperatureColor(feature.properties.temperature),
                            fillOpacity: 0.45
                        };
                    },

                    onEachFeature: function (feature, layer) {
                        layer.bindPopup("<strong>Max Temperature<strong>: " + feature.properties.temperature + "°C");
                    }
                });

                // Store the layer in the array
                layers.push(layer);

                // Add the first layer to the map
                if (index === 0) {
                    layer.addTo(map);
                }
            });
        })
        .catch(error => console.error('Error fetching GeoJSON layers:', error));
}

// Create map legend
let legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend'),
        grades = [
            { name: 'Deep freeze', tempRange: '<0', color: '#0000FF' },
            { name: 'Very cold', tempRange: '0-5', color: '#0066FF' },
            { name: 'Cold', tempRange: '5-10', color: '#3399FF' },
            { name: 'Cool', tempRange: '10-15', color: '#99CCFF' },
            { name: 'Mild', tempRange: '15-20', color: '#ADD8E6' },
            { name: 'Warm', tempRange: '20-25', color: '#FFFF99' },
            { name: 'Hot', tempRange: '25-30', color: '#FFCC66' },
            { name: 'Very hot', tempRange: '30-35', color: '#FF9900' },
            { name: 'Scorching', tempRange: '35+', color: '#FF0000' }
        ];
    
    // Customise the legend background
    div.style.background = '#ffffff';
    div.style.padding = '10px';
    div.style.borderRadius = '8px';  // Set the border radius

    // loop through our density intervals and generate a label with a colored square for each interval
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + grades[i].color + '; border: 0.25px solid lightgrey; width: 10px; height: 10px; float: left; margin-top: 3.5px; margin-right: 8px;"></i>' +
            grades[i].name + ' (<strong>' + grades[i].tempRange + '°C</strong>)' + (grades[i + 1] ? '<br>' : '');
    }
    return div;
};

// Add legend to map
legend.addTo(map);

// Call the fetchAndAddLayers function with the layer names you want to load (only the h3 grid cell files)
fetchAndAddLayers(['grid_res_6', 'grid_res_5', 'grid_res_4']);