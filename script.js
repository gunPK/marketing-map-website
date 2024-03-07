document.addEventListener('DOMContentLoaded', () => {
    // Initialize the map right away but with interactions disabled
    initMap();

    // Display the modal form on top of the map
    const formPopup = document.getElementById('formPopup');
    formPopup.style.display = 'block';

    // Handle the form submission to enable map interactions
    document.getElementById('accessForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Extract values from the form
        var postalCode = document.getElementById('postalCode').value;
        var email = document.getElementById('email').value;

        // Here, send the postalCode and email to your server or process as needed
        console.log('Postal Code:', postalCode, 'Email:', email);

        // Hide the modal form
        formPopup.style.display = 'none';

        // Enable interactions with the map
        enableMapInteractions();
    });
});

function initMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZ2JhY2hwayIsImEiOiJjbHQ1eHZqY2QwNHlsMmxzNmo4eGh0eGljIn0.QF4qv-luDA9jECbYRTshJA';
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/gbachpk/cltdb5k8600or01rac2wbh0q3', // map style URL
        center: [-95.7129, 37.0902], // starting position [lng, lat]
        zoom: 3, // starting zoom level
        interactive: false // initially disable map interactions
    });

    // Store the map instance for later use
    window.mapInstance = map;
}

function enableMapInteractions() {
    if (window.mapInstance) {
        // Enable all interactions
        window.mapInstance.boxZoom.enable();
        window.mapInstance.scrollZoom.enable();
        window.mapInstance.dragRotate.enable();
        window.mapInstance.dragPan.enable();
        window.mapInstance.keyboard.enable();
        window.mapInstance.doubleClickZoom.enable();
        window.mapInstance.touchZoomRotate.enable();
    }
}
