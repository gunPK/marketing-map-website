mapboxgl.accessToken = 'pk.eyJ1IjoiZ2JhY2hwayIsImEiOiJjbHQ1eHZqY2QwNHlsMmxzNmo4eGh0eGljIn0.QF4qv-luDA9jECbYRTshJA';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/gbachpk/cltdb5k8600or01rac2wbh0q3', // Your Mapbox style URL
    center: [-95.7129, 37.0902], // Default map center [longitude, latitude]
    zoom: 3 // Default zoom level
});

map.on('load', function () {
  // Existing map initialization code

  // Initialize the Geocoder
  var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: false // Set to true if you want a marker to appear at the search location
  });

  // Add the geocoder to your map
  document.getElementById('map').appendChild(geocoder.onAdd(map));
});


map.on('load', () => {
    // Event listener for clicking on a feature within the specified layer
    map.on('click', 'merged-data-points-7n4pjn', (e) => {
        // Ensure that the clicked feature's coordinates are in a format that can be used
        const coordinates = e.features[0].geometry.coordinates.slice();
        // Access the properties of the clicked feature
        const properties = e.features[0].properties;
        
        // Example description - customize this to include the information you want to display
        // This assumes your feature has a property named 'NAME'
        const description = `<h4>${properties.NAME}</h4><p>Message Count: ${properties.message_count}, Contractor Count: ${properties.contractor_count}</p>`;
        
        // Create and show a popup with the feature's information
        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
    });

    // Change the cursor to a pointer when it enters a feature in the layer
    map.on('mouseenter', 'merged-data-points-7n4pjn', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Revert the cursor to the default when it leaves a feature in the layer
    map.on('mouseleave', 'merged-data-points-7n4pjn', () => {
        map.getCanvas().style.cursor = '';
    });
});
