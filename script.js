document.addEventListener('DOMContentLoaded', function() {
    // Show the modal form overlay initially
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.style.display = 'flex';

    // Form submission event listener
    document.getElementById('accessForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Hide the modal overlay upon form submission
        modalOverlay.style.display = 'none';

        // Optionally, process form data here (e.g., log to console or send to a server)
        const postalCode = document.getElementById('postalCode').value;
        const email = document.getElementById('email').value;
        console.log('Postal Code:', postalCode, 'Email:', email);

        // Enable map interactions after form submission
        enableMapInteractions();
    });

    // Initialize the map in a non-interactive state
    initMap();
});

function initMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZ2JhY2hwayIsImEiOiJjbHQ1eHZqY2QwNHlsMmxzNmo4eGh0eGljIn0.QF4qv-luDA9jECbYRTshJA';
    window.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/gbachpk/cltdb5k8600or01rac2wbh0q3',
        center: [-95.7129, 37.0902],
        zoom: 3,
        interactive: false // Map starts as non-interactive
    });

    map.on('load', () => {
        // After map load, initialize and append the Geocoder and reset button
        setupControls();
    });
}

function setupControls() {
    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false
    });

    const controlsContainer = document.createElement('div');
    controlsContainer.setAttribute('style', 'position: absolute; top: 10px; left: 50%; transform: translateX(-50%); display: flex; align-items: center;');
    controlsContainer.id = 'controls-container';

    controlsContainer.appendChild(geocoder.onAdd(map));

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset View';
    resetButton.id = 'reset-button';
    resetButton.setAttribute('style', 'margin-right: 8px;');
    resetButton.addEventListener('click', () => {
        map.flyTo({
            center: [-95.7129, 37.0902],
            zoom: 3,
            essential: true
        });
    });

    controlsContainer.insertBefore(resetButton, controlsContainer.firstChild);
    document.getElementById('map').appendChild(controlsContainer);
}

function enableMapInteractions() {
    map.boxZoom.enable();
    map.scrollZoom.enable();
    map.dragRotate.enable();
    map.dragPan.enable();
    map.keyboard.enable();
    map.doubleClickZoom.enable();
    map.touchZoomRotate.enable();
    map.setStyle('mapbox://styles/gbachpk/cltdb5k8600or01rac2wbh0q3'); // Reset or set style if needed
    // Now, the map is interactive.
}
