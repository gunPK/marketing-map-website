document.addEventListener('DOMContentLoaded', function() {
    const modalOverlay = document.getElementById('modalOverlay');
    
    // Initially display the modal overlay
    showModal();
    
    // Form submission event listener
    document.getElementById('accessForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior
        
        // Retrieve the value of each form field
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        const postalCode = document.getElementById('postalCode').value;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const companyName = document.getElementById('companyName').value;
        
        // Example: Log the values to the console (you might replace this with your actual use case)
        console.log('City:', city, 'State:', state, 'Postal Code:', postalCode, 
                    'Name:', name, 'Email:', email, 'Phone:', phone, 'Company Name:', companyName);
        
        // Hide the modal overlay upon form submission and enable map interactions
        hideModal();
        enableMapInteractions();

        // Geocode the city/state and navigate to the area
        geocodeAndZoom(city, state);
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
    map.on('click', 'prokeep-contractors-msa-map-4djxdr', function(e) { // Replace 'prokeep-contractors-msa-map-4djxdr' with your actual layer ID
        var coordinates = e.features[0].geometry.coordinates.slice();
        
        var properties = e.features[0].properties;
        if (!properties) return; // Check if properties exist

        var description = `<h4>${properties.address}</h4>`;
        if (properties['Prokeep Locations']) { 
            description += `<p>Prokeep Locations: ${properties['Prokeep Locations']}<br>`;
        }
        if (properties['Contractors Using Prokeep']) { 
            description += `Contractors Using Prokeep: ${properties['Contractors Using Prokeep']}<br>`;
        }
        // if (properties['Messages Exchanged']) {
        //     description += `Messages Exchanged: ${properties['Messages Exchanged']}</p>`;
        // }

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

// Function to geocode city/state and navigate to the area
function geocodeAndZoom(city, state) {
    const accessToken = mapboxgl.accessToken; // Ensure your access token is correctly set
    const query = `${city}, ${state}`;
    const country = 'US'; // ISO 3166-1 alpha-2 country code for the United States
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?country=${country}&access_token=${accessToken}&limit=1`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.features.length > 0) {
                const [longitude, latitude] = data.features[0].geometry.coordinates;
                map.flyTo({
                    center: [longitude, latitude],
                    zoom: 12 // Adjust the zoom level as necessary
                });
                openNearestPinPopup(longitude, latitude);
            } else {
                console.error('Location not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching coordinates:', error);
        });
}

function openNearestPinPopup(longitude, latitude) {
    const features = map.queryRenderedFeatures({
        layers: ['prokeep-contractors-msa-map-4djxdr'],
        filter: ['==', '$type', 'Point'] // Filter only Point features
    });

    if (!features.length) {
        console.log('No features found.');
        return;
    }

    let nearestFeature = null;
    let nearestDistance = Infinity;

    // Calculate distance from each feature to the given location
    features.forEach(feature => {
        const coords = feature.geometry.coordinates;
        const distance = mapboxgl.MercatorCoordinate.fromLngLat({ lon: longitude, lat: latitude })
            .distanceTo(mapboxgl.MercatorCoordinate.fromLngLat({ lon: coords[0], lat: coords[1] }));

        if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestFeature = feature;
        }
    });

    if (nearestFeature) {
        const coordinates = nearestFeature.geometry.coordinates;
        const description = nearestFeature.properties.description; // Assuming pin data contains a description

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
    }
    else {
        console.error('No nearest feature found.');
    }
}

