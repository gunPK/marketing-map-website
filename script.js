document.addEventListener('DOMContentLoaded', function() {
    const modalOverlay = document.getElementById('modalOverlay');
    
    // Initially display the modal overlay
    showModal();

    // Form submission event listener
    document.getElementById('accessForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        const postalCode = document.getElementById('postalCode').value;
        const email = document.getElementById('email').value;
        const companyName = document.getElementById('companyName').value;
        console.log('Postal Code:', postalCode, 'Email:', email, 'Company Name:', companyName);

        // Hide the modal overlay upon form submission and enable map interactions
        hideModal();
        enableMapInteractions();
    });

    // Initialize the map in a non-interactive state
    initMap();
});

function showModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.add('show'); // Use CSS transitions for smooth appearance
}

function hideModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.remove('show'); // Use CSS transitions for smooth disappearance
}

function initMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZ2JhY2hwayIsImEiOiJjbHQ1eHZqY2QwNHlsMmxzNmo4eGh0eGljIn0.QF4qv-luDA9jECbYRTshJA';
    window.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/gbachpk/cltdb5k8600or01rac2wbh0q3',
        center: [-95.7129, 37.0902],
        zoom: 3,
        interactive: false
    });

    map.on('load', function() {
        setupControls();
        
        // Here is where you add the click event for the pins, ensuring the map and layers are fully loaded
        map.on('click', 'merged-data-points-7n4pjn', function(e) { 
            var coordinates = e.features[0].geometry.coordinates.slice();
            
            var properties = e.features[0].properties;
            if (!properties) return; // Check if properties exist
            
            var description = `<h4>${properties.NAME}</h4><p>Location Count: ${properties.location_count}<br>Contractor Count: ${properties.contractor_count}<br>Message Count: ${properties.message_count}</p>`; // Customize based on your data properties

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
        });
    });
}

function setupControls() {
    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false
    });

    // ADJUST ZOOM LEVEL ON SEARCH RESULT
    // geocoder.on('result', function(e) {
    //     // Extract coordinates from the geocoder result
    //     const coordinates = e.result.center;
    //     // Fly to the coordinates with a custom zoom level
    //     map.flyTo({
    //         center: coordinates,
    //         zoom: 10,
    //         essential: true
    //     });
    // });

    // BRING TO NEAREST PLOTTED POINT ON SEARCH
    // Modify the geocoder event listener to handle search results
    geocoder.on('result', function(result) {
        // Extract the coordinates of the search result
        const coordinates = result.result.geometry.coordinates;
    
        // Query the rendered features from the specified layer
        const renderedFeatures = map.queryRenderedFeatures('merged-data-points-7n4pjn');
    
        // Find the nearest feature to the search result
        let nearestFeature;
        let nearestDistance = Infinity;
        renderedFeatures.forEach(feature => {
            const distance = mapboxgl.MercatorCoordinate.distance(
                { x: coordinates[0], y: coordinates[1] },
                { x: feature.geometry.coordinates[0], y: feature.geometry.coordinates[1] }
            );
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestFeature = feature;
            }
        });
    
        // Fly to the nearest feature if found
        if (nearestFeature) {
            map.flyTo({
                center: nearestFeature.geometry.coordinates,
                zoom: 15 // Adjust the zoom level as needed
            });
        }
    });



    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'controls-container';
    document.getElementById('map').appendChild(controlsContainer);

    controlsContainer.appendChild(geocoder.onAdd(map));

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset View';
    resetButton.id = 'reset-button';
    resetButton.addEventListener('click', function() {
        map.flyTo({
            center: [-95.7129, 37.0902],
            zoom: 3,
            bearing: 0,
            pitch: 0,
            essential: true
        });
    });

    controlsContainer.insertBefore(resetButton, controlsContainer.firstChild);
}

function enableMapInteractions() {
    map.boxZoom.enable();
    map.scrollZoom.enable();
    map.dragRotate.enable();
    map.dragPan.enable();
    map.keyboard.enable();
    map.doubleClickZoom.enable();
    map.touchZoomRotate.enable();
    map.setStyle('mapbox://styles/gbachpk/cltdb5k8600or01rac2wbh0q3'); // This makes the map interactive
}
