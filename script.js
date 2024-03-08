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
        
        // Add click event for pins, ensuring map and layers are fully loaded
        map.on('click', 'merged-data-points-7n4pjn', function(e) {
            var coordinates = e.features[0].geometry.coordinates.slice();
            
            var properties = e.features[0].properties;
            if (!properties) return; // Check if properties exist
            
            var description = `<h4>${properties.NAME}</h4><p>Location Count: ${properties.location_count}<br>Contractor Count: ${properties.contractor_count}<br>Message Count: ${properties.message_count}</p>`;
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

    geocoder.on('result', function(result) {
        const searchCoordinates = result.result.geometry.coordinates;
        findNearestFeature(searchCoordinates);
    });

    document.getElementById('controls-container').appendChild(geocoder.onAdd(map));

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

    document.getElementById('controls-container').appendChild(resetButton);
}

function findNearestFeature(searchCoordinates) {
    map.once('idle', () => {
        const features = map.queryRenderedFeatures({layers: ['merged-data-points-7n4pjn']});
        let nearestFeature = null;
        let nearestDistance = Infinity;

        features.forEach(feature => {
            const featureCoordinates = feature.geometry.coordinates;
            const distance = calculateDistance(searchCoordinates, featureCoordinates);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestFeature = feature;
            }
        });

        if (nearestFeature) {
            map.flyTo({
                center: nearestFeature.geometry.coordinates,
                zoom: 15 // Adjust zoom level as needed
            });
        }
    });
}

function calculateDistance(point1, point2) {
    const lat1 = toRadians(point1[1]);
    const lon1 = toRadians(point1[0]);
    const lat2 = toRadians(point2[1]);
    const lon2 = toRadians(point2[0]);
    const dlon = lon2 - lon1;
    const dlat = lat2 - lat1;
    const a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const R = 6371; // Radius of the Earth in kilometers
    return R * c;
}

function toRadians(degrees) {
    return degrees * Math.PI / 180;
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
