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
        
        map.on('click', 'merged-data-points-7n4pjn', function(e) {
            var coordinates = e.features[0].geometry.coordinates.slice();
            var properties = e.features[0].properties;
            if (!properties) return;

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

    geocoder.on('result', function(e) {
        const searchCoordinates = e.result.geometry.coordinates;
        map.once('moveend', () => {
            const center = map.getCenter().toArray();
            findNearestFeature(center);
        });
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

function findNearestFeature(center) {
    const features = map.queryRenderedFeatures({layers: ['merged-data-points-7n4pjn']});
    let nearestFeature = null;
    let nearestDistance = Infinity;
    features.forEach(feature => {
        const distance = calculateDistance(center, feature.geometry.coordinates);
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
}

function enableMapInteractions() {
    map.setStyle('mapbox://styles/gbachpk/cltdb5k8600or01rac2wbh0q3'); // This makes the map interactive
    map.boxZoom.enable();
    map.scrollZoom.enable();
    map.dragRotate.enable();
    map.dragPan.enable();
    map.keyboard.enable();
    map.doubleClickZoom.enable();
    map.touchZoomRotate.enable();
}

function calculateDistance(from, to) {
    const [lon1, lat1] = from;
    const [lon2, lat2] = to;
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
