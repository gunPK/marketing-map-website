let myGeoJSON;

document.addEventListener('DOMContentLoaded', function() {
    fetch('Prokeep Contractors MSA Map - Sales.geojson')
    .then(response => response.json())
    .then(data => {
        myGeoJSON = data;
        console.log('GeoJSON loaded successfully');
        // Now you can use myGeoJSON in your site
    })
    .catch(error => console.error('Error loading GeoJSON:', error));
    
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
        geocodeAndZoom(city, state, postalCode);
    });
    
    // Initialize the map in a non-interactive state
    initMap();
});

function generatePopupContent(properties) {

    const trimmedAddress = properties.address.substring(0, properties.address.length - 5);

    let description = `<div class="popup-container">
                            <img src="prokeep-long-logo.webp" alt="Prokeep Logo" class="popup-logo">
                            <h4 class="popup-title">${trimmedAddress}</h4>`;
    
    // if (properties['Prokeep Locations']) { 
    //     description += `<p>Prokeep Locations: ${properties['Prokeep Locations']}<br>`;
    // }
    
    if (properties['Contractors Using Prokeep']) { 
        description += `<p class="popup-description">Contractors Texting in Area: ${properties['Contractors Using Prokeep']}</p>`;
    }
    
    // if (properties['Messages Exchanged']) {
    //     description += `Messages Exchanged: ${properties['Messages Exchanged']}</p>`;
    // }

    description += `</div>`;
    
    return description;
}

function showModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.style.display = 'flex'; // Make sure the modal is part of the layout
    setTimeout(() => modalOverlay.style.opacity = 1, 10); // Start the opacity transition slightly after
}

function hideModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.style.opacity = 0; // Start fading out
    modalOverlay.addEventListener('transitionend', function handleTransitionEnd() {
        modalOverlay.style.display = 'none'; // Fully hide the modal after the transition
        modalOverlay.removeEventListener('transitionend', handleTransitionEnd); // Clean up the event listener
    }, { once: true });
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

        var description = generatePopupContent(properties);

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

    // Listen for the 'result' event on the geocoder to handle search results
    geocoder.on('result', function(e) {
        // Extract the location's longitude and latitude from the search result
        const longitude = e.result.geometry.coordinates[0];
        const latitude = e.result.geometry.coordinates[1];

        const searchText = e.query;
        console.log("Text Entered in search bar:", searchText);

        // Extract the city from the search result context
        const city = extractCityFromContext(e.result.context);
        console.log("City from Geocoder Result:", city); // Add this line for debugging

        // Use the logic to find the nearest pin and adjust the map view accordingly
        openNearestPinPopup(longitude, latitude, city);
    });

    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'controls-container';
    document.getElementById('map').appendChild(controlsContainer);
    controlsContainer.appendChild(geocoder.onAdd(map));

    // Create and configure the 'Reset View' button
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

    // Insert the reset button into the controls container
    controlsContainer.insertBefore(resetButton, controlsContainer.firstChild);
}

// Get the city from the geocoder results (from interactive map search bar)
function extractCityFromContext(context) {
    // Iterate over the context to find the city
    for (const item of context) {
        console.log('Item:', item);
        if (item.id.includes('place') && item.text) {
            console.log('Found city:', item.text);
            return item.text;
        }
    }
    return null; // Return null if city not found
}

function enableMapInteractions() {
    map.boxZoom.enable();
    map.scrollZoom.enable();
    map.dragRotate.enable();
    map.dragPan.enable();
    map.keyboard.enable();
    map.doubleClickZoom.enable();
    map.touchZoomRotate.enable();
    map.setStyle('mapbox://styles/gbachpk/cltdb5k8600or01rac2wbh0q3');
}

// Function to geocode city/state and navigate to the area
function geocodeAndZoom(city, state, postalCode) {
    const accessToken = mapboxgl.accessToken; // Ensure your access token is correctly set
    const query = `${city}, ${state} ${postalCode}`;
    const country = 'US'; // ISO 3166-1 alpha-2 country code for the United States
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?country=${country}&access_token=${accessToken}&limit=1`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.features.length > 0) {
                const [longitude, latitude] = data.features[0].geometry.coordinates;
                
                // Instead of flying to the coordinates, pass them to openNearestPinPopup
                // openNearestPinPopup will handle showing the pin and adjusting the map view
                openNearestPinPopup(longitude, latitude, city);
            } else {
                console.error('Location not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching coordinates:', error);
        });
}


function calculateDistance(lat1, lon1, lat2, lon2) {
    function toRad(x) {
        return x * Math.PI / 180;
    }

    var R = 6371; // Earth’s mean radius in kilometers
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in kilometer
}

// function findNearestFeature(longitude, latitude, geojsonData) {
//     let nearestFeature = null;
//     let smallestDistance = Infinity;

//     geojsonData.features.forEach(feature => {
//         const [featureLon, featureLat] = feature.geometry.coordinates;
//         const distance = calculateDistance(latitude, longitude, featureLat, featureLon);

//         if (distance < smallestDistance) {
//             smallestDistance = distance;
//             nearestFeature = feature;
//         }
//     });

//     return nearestFeature;
// }

function findNearestFeature(longitude, latitude, geojsonData, city) {
    let nearestFeatures = [];
    let nearestDistances = [];
    const numNearest = 3; // Number of nearest pins to consider
    
    geojsonData.features.forEach(feature => {
        const [featureLon, featureLat] = feature.geometry.coordinates;
        const distance = calculateDistance(latitude, longitude, featureLat, featureLon);

        // Keep track of the nearest features and their distances
        if (nearestFeatures.length < numNearest || distance < nearestDistances[nearestDistances.length - 1]) {
            let indexToInsert = nearestDistances.findIndex(dist => distance < dist);
            if (indexToInsert === -1) indexToInsert = nearestDistances.length;
            nearestFeatures.splice(indexToInsert, 0, feature);
            nearestDistances.splice(indexToInsert, 0, distance);
            if (nearestFeatures.length > numNearest) {
                nearestFeatures.pop();
                nearestDistances.pop();
            }
        }
    });

    console.log("Nearest Features:", nearestFeatures); 
    
    // Check if any of the nearest features have the city name in their titles
    const nearestFeatureWithCity = nearestFeatures.find(feature => {
        // console.log("Feature Properties:", feature.properties);
        return feature.properties.address && feature.properties.address.includes(city);
    });
    
    return nearestFeatureWithCity || nearestFeatures[0]; // Return the nearest feature with the city name if found, otherwise return the nearest feature overall
}


function openNearestPinPopup(longitude, latitude, city) {
    if (!myGeoJSON) {
        console.log("GeoJSON data isn't loaded yet.");
        return;
    }

    const nearestFeature = findNearestFeature(longitude, latitude, myGeoJSON, city);
    
    if (nearestFeature) {
        const nearestCoords = nearestFeature.geometry.coordinates;
        
        // Create bounds that will include both the searched location and the nearest pin
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend([longitude, latitude]); // Extend bounds to include the searched location
        bounds.extend(nearestCoords); // Extend bounds to include the nearest pin

        // Adjust the map view with an animation to include both points
        map.fitBounds(bounds, {
            padding: {top: 50, bottom:50, left: 50, right: 50}, // Adjust padding as needed
            maxZoom: 12, // Prevent the map from zooming in too far
            duration: 1000 // Adjust duration of the animation as needed
        });

        // After adjusting the view, display the popup for the nearest feature
        const description = generatePopupContent(nearestFeature.properties);
        new mapboxgl.Popup()
            .setLngLat(nearestCoords)
            .setHTML(description)
            .addTo(map);
    } else {
        console.log('No nearest feature found.');
    }
}

