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

        // Initialize the map
        initMap();
    });
});

// Function to initialize the map
function initMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZ2JhY2hwayIsImEiOiJjbHQ1eHZqY2QwNHlsMmxzNmo4eGh0eGljIn0.QF4qv-luDA9jECbYRTshJA';

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/gbachpk/cltdb5k8600or01rac2wbh0q3',
        center: [-95.7129, 37.0902],
        zoom: 3
    });

    map.on('load', () => {
        // Initialize the Geocoder
        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            marker: false
        });

        // Create a container for the Geocoder and the reset button
        const controlsContainer = document.createElement('div');
        controlsContainer.style.position = 'absolute';
        controlsContainer.style.top = '10px';
        controlsContainer.style.left = '50%';
        controlsContainer.style.transform = 'translateX(-50%)';
        controlsContainer.style.display = 'flex';
        controlsContainer.style.alignItems = 'center';
        controlsContainer.id = 'controls-container';

        // Append the Geocoder to the container
        controlsContainer.appendChild(geocoder.onAdd(map));

        // Create and configure the reset button
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset View';
        resetButton.id = 'reset-button';
        resetButton.style.marginRight = '8px'; // Adds space between the reset button and the search bar

        // Insert the reset button before the Geocoder in the container
        controlsContainer.insertBefore(resetButton, controlsContainer.firstChild);

        // Append the container to the map
        document.getElementById('map').appendChild(controlsContainer);

        // Reset button functionality
        resetButton.addEventListener('click', () => {
            map.flyTo({
                center: [-95.7129, 37.0902],
                zoom: 3,
                essential: true
            });
        });

        // Add click event listeners for the features
        map.on('click', 'merged-data-points-7n4pjn', (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const properties = e.features[0].properties;

            const description = `<h4>${properties.NAME}</h4><p>Message Count: ${properties.message_count}<br>Contractor Count: ${properties.contractor_count}</p>`;

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
        });

        // Cursor style changes on feature enter/leave
        map.on('mouseenter', 'merged-data-points-7n4pjn', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'merged-data-points-7n4pjn', () => {
            map.getCanvas().style.cursor = '';
        });
    });
}
