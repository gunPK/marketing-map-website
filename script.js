mapboxgl.accessToken = 'pk.eyJ1IjoiZ2JhY2hwayIsImEiOiJjbHQ1eHZqY2QwNHlsMmxzNmo4eGh0eGljIn0.QF4qv-luDA9jECbYRTshJA';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/gbachpk/cltdb5k8600or01rac2wbh0q3', // Replace with your style URL from Mapbox Studio
    center: [-95.7129, 37.0902], // Default center on the map (you can adjust this)
    zoom: 3 // Default zoom level
});

map.on('load', () => {
    // Event listener for clicking on a feature
    map.on('click', 'merged-data-points-7n4pjn', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const properties = e.features[0].properties; // Access feature properties
        
        // Example: Customize this to include the information you want to display
        const description = `<h4>${properties.NAME}</h4><p>More info here...</p>`;
        
        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
    });

    // Change the cursor to a pointer when it enters a feature in the 'your-layer-id' layer.
    map.on('mouseenter', 'merged-data-points-7n4pjn', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a default cursor when it leaves.
    map.on('mouseleave', 'merged-data-points-7n4pjn', () => {
        map.getCanvas().style.cursor = '';
    });
});
