mapboxgl.accessToken = 'pk.eyJ1IjoiZ2JhY2hwayIsImEiOiJjbHQ1eHZqY2QwNHlsMmxzNmo4eGh0eGljIn0.QF4qv-luDA9jECbYRTshJA';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/gbachpk/cltdb5k8600or01rac2wbh0q3', // Your Mapbox style URL
    center: [-95.7129, 37.0902], // Default map center [longitude, latitude]
    zoom: 3 // Default zoom level
});

map.on('load', () => {
    // Initialize the Geocoder
    var geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false // Set to true if you want a marker to appear at the search location
    });

    // Add the geocoder to your map
    document.getElementById('map').appendChild(geocoder.onAdd(map));

    // Move reset button to the left of the search bar (Geocoder)
    document.querySelector('.mapboxgl-ctrl-geocoder').insertAdjacentElement('beforebegin', document.getElementById('reset-button'));

    // Event listener for clicking on a feature within the specified layer
    map.on('click', 'merged-data-points-7n4pjn', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const properties = e.features[0].properties;
        
        const description = `<h4>${properties.NAME}</h4><p>Message Count: ${properties.message_count}<br>Contractor Count: ${properties.contractor_count}</p>`;
        
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

    // Reset button functionality to move the map back to the initial position
    document.getElementById('reset-button').addEventListener('click', function() {
        map.flyTo({
            center: [-95.7129, 37.0902], // Original center
            zoom: 3, // Original zoom level
            essential: true // This ensures the animation is performed
        });
    });
});
