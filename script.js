document.addEventListener('DOMContentLoaded', function() {
    const formPopup = document.getElementById('formPopup');
    formPopup.style.display = 'block';

    document.getElementById('accessForm').addEventListener('submit', function(event) {
        event.preventDefault();
        formPopup.style.display = 'none';
        
        var postalCode = document.getElementById('postalCode').value;
        var email = document.getElementById('email').value;
        console.log('Postal Code:', postalCode, 'Email:', email);

        // Enable interactions with the map, including the Geocoder and reset button
        enableMapInteractions();
    });

    initMap();
});

function initMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZ2JhY2hwayIsImEiOiJjbHQ1eHZqY2QwNHlsMmxzNmo4eGh0eGljIn0.QF4qv-luDA9jECbYRTshJA';
    window.map = new mapboxgl.Map({
        container: 'map',
        style: 'YOUR_MAP_STYLE',
        center: [-95.7129, 37.0902],
        zoom: 3,
        interactive: false // Start with a non-interactive map
    });

    // Add the Geocoder and reset button but keep them disabled initially
    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false
    });

    document.getElementById('map').appendChild(geocoder.onAdd(window.map));

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset View';
    resetButton.id = 'reset-button';
    resetButton.onclick = function() {
        window.map.flyTo({
            center: [-95.7129, 37.0902],
            zoom: 3
        });
    };
    document.getElementById('map').appendChild(resetButton);
}

function enableMapInteractions() {
    // Enable map interactions
    window.map.boxZoom.enable();
    window.map.scrollZoom.enable();
    window.map.dragPan.enable();
    window.map.dragRotate.enable();
    window.map.keyboard.enable();
    window.map.doubleClickZoom.enable();
    window.map.touchZoomRotate.enable();

    // Enable or visually activate the Geocoder and reset button if necessary
    document.getElementById('reset-button').style.visibility = 'visible';
    // You may need to adjust the visibility or interactivity of the Geocoder separately
}
