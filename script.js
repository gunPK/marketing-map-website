document.addEventListener('DOMContentLoaded', () => {
    // Display the modal form immediately
    const formPopup = document.getElementById('formPopup');
    formPopup.style.display = 'block';

    document.getElementById('accessForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting in the traditional way

        // Extract values from form
        var postalCode = document.getElementById('postalCode').value;
        var email = document.getElementById('email').value;

        // Here, you'd send the data to a server or process it as needed
        console.log('Postal Code:', postalCode, 'Email:', email);

        // Hide the form popup
        formPopup.style.display = 'none';

        // Proceed to initialize the map
        initMap();
    });
});

function initMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZ2JhY2hwayIsImEiOiJjbHQ1eHZqY2QwNHlsMmxzNmo4eGh0eGljIn0.QF4qv-luDA9jECbYRTshJA';

    const map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/gbachpk/cltdb5k8600or01rac2wbh0q3', // style URL
        center: [-95.7129, 37.0902], // starting position [lng, lat]
        zoom: 3 // starting zoom
    });

    // After the map loads, add controls and other map interactions here
    map.on('load', () => {
        // Initialize the Geocoder
        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            marker: false
        });

        // Create a container for the Geocoder and the reset button
        const controlsContainer = document.createElement('div');
        controlsContainer.setAttribute('style', 'position: absolute; top: 10px; left: 50%; transform: translateX(-50%); display: flex; align-items: center;');
        controlsContainer.id = 'controls-container';

        // Append the Geocoder to the container
        controlsContainer.appendChild(geocoder.onAdd(map));

        // Create and configure the reset button
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

        // Insert the reset button before the Geocoder in the container
        controlsContainer.insertBefore(resetButton, controlsContainer.firstChild);

        // Append the container to the map
        document.getElementById('map').appendChild(controlsContainer);

        // Additional map interactions like 'click' events for map features can be added here
    });
}
