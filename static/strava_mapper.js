console.log("Script is running");

function decodePolyline(encoded) {
    let points = [];
    let index = 0,
        len = encoded.length;
    let lat = 0,
        lng = 0;

    while (index < len) {
        let b, shift = 0,
            result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const deltaLat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += deltaLat;

        shift = 0;
        result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const deltaLng = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += deltaLng;

        points.push([lat * 1e-5, lng * 1e-5]);
    }

    return points;
}

async function fetchActivitiesData() {
    try {
        const response = await fetch('/api/map'); // Flask API endpoint
        if (!response.ok) throw new Error('Failed to fetch activities data');
        return await response.json();
    } catch (error) {
        console.error('Error fetching activities data:', error);
        return { error: 'Failed to fetch activities data' };
    }
}

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressBar = document.getElementById('progressBar');

    // Start the progress bar animation
    progressBar.style.width = '100%';

    
    // Fetch athlete and activities data
    const { athlete, activities, error } = await fetchActivitiesData();
    if (error) {
        loadingScreen.innerHTML = `<p style="color: white;">Failed to load data. Please refresh the page.</p>`;
        console.error(error);
        return;
    }

    // Athlete home data
    const city = athlete.city;
    const state = athlete.state;
    const country = athlete.country;

    // Initialize the map
    const map = L.map('viewDiv').setView([39.8283, -98.5795], 4); // Centered on the US

    // Define tile layers for different themes
    const tileLayers = {
        outdoors: L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.{ext}', {
            minZoom: 0,
            maxZoom: 20,
            attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            ext: 'png'
        }),
        dark: L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
            minZoom: 0,
            maxZoom: 20,
            attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            ext: 'png'
        }),
        topographic: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
        })
    };

    // Add the default tile layer to the map
    let currentLayer = tileLayers.outdoors;
    currentLayer.addTo(map);

    // Create a layer group for polylines
    const polylineGroup = L.layerGroup().addTo(map);

    // Add GeoSearch control to the map
    const searchControl = new GeoSearch.GeoSearchControl({
    provider: new GeoSearch.OpenStreetMapProvider(), 
    searchLabel: "Search location",
    style: 'bar', 
    showMarker: false,
    retainZoomLevel: false, 
    animateZoom: true, 
    });
    
    map.addControl(searchControl)

    // Function to render activities as polylines
    function renderPolylines(activities) {
        polylineGroup.clearLayers(); // Clear existing polylines

        activities.forEach((activity) => {
            const polylineString = activity.map?.summary_polyline;

            if (polylineString) {
                const decodedPolyline = decodePolyline(polylineString);

                // Create a polyline and add it to the polyline group
                const polyline = L.polyline(decodedPolyline, {
                    color: 'blue',
                    weight: 2
                }).addTo(polylineGroup);

                // Add popups with activity details
                const name = activity.name;
                const distanceKm = activity.distance / 1000; // Convert meters to kilometers
                const distanceMiles = (distanceKm * 0.621371).toFixed(2);
                const movingTimeSeconds = activity.moving_time;
                const hours = Math.floor(movingTimeSeconds / 3600);
                const minutes = Math.floor((movingTimeSeconds % 3600) / 60);
                const seconds = movingTimeSeconds % 60;
                const formattedTime = `${hours}h ${minutes}m ${seconds}s`;

                polyline.bindPopup(`
                    <h2>${name}</h2>
                    <h3>Distance: ${distanceMiles}mi</h3>
                    <h3>Duration: ${formattedTime}</h3>
                    <a href="https://www.strava.com/activities/${activity.id}" target="_blank">Full Activity Details</a>
                `);

                 // Add click event listener to highlight the clicked polyline
                polyline.on('click', (e) => {
                    // Prevent map's click event from resetting the polyline
                    e.originalEvent.stopPropagation();

                    // Reset the previous polyline's color to blue
                    if (lastClickedPolyline && lastClickedPolyline !== polyline) {
                        lastClickedPolyline.setStyle({ color: 'blue' });
                    }

                    // Highlight the clicked polyline
                    polyline.setStyle({ color: 'red' });

                    // Update the reference to the currently clicked polyline
                    lastClickedPolyline = polyline;

                    // Get the bounds of the polyline
                    const bounds = polyline.getBounds();

                    // Calculate the center of the bounds
                    const center = bounds.getCenter();

                    // Adjust the zoom level based on the bounds size
                    const zoomLevel = Math.min(map.getZoom() + 1, map.getBoundsZoom(bounds));

                    // Fly to the center of the polyline with the adjusted zoom level
                    map.flyTo(center, zoomLevel, {
                        animate: true,
                        duration: 0.5
                    });       
                });
            }
        });
    }

    let lastClickedPolyline = null; // Keep track of the last clicked polyline

    // Render the initial set of polylines
    renderPolylines(activities);

    // Add a click event listener to the map to reset the currently selected polyline
    map.on('click', () => {
    if (lastClickedPolyline) {
        lastClickedPolyline.setStyle({ color: 'blue' }); // Reset the color to default
        lastClickedPolyline = null; // Clear the reference
    }
    });

    // Add theme-switching functionality
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', (event) => {
            const selectedTheme = event.target.dataset.theme;

            if (tileLayers[selectedTheme]) {
                map.removeLayer(currentLayer); // Remove the current tile layer
                currentLayer = tileLayers[selectedTheme]; // Update the current layer
                currentLayer.addTo(map); // Add the new tile layer
            }
        });
    });

    // Modifying zoom control class
    const targetDiv = document.querySelector("#viewDiv .leaflet-top.leaflet-left");
    if (targetDiv) {
        targetDiv.classList.remove("leaflet-top");
        targetDiv.classList.add("leaflet-bottom");
    }

    // Hide the loading screen once the map is ready
    loadingScreen.style.display = 'none';

    // Use athlete's city and state to get coordinates
    const geocoder = new GeoSearch.OpenStreetMapProvider();

    try {
        const results = await geocoder.search({ query: `${city}, ${state}, ${country}` });

        if (results && results.length > 0) {
            const { x: lon, y: lat } = results[0];

            // Fly to the athlete's city
            map.flyTo([lat, lon], 12, {
                animate: true,
                duration: 1.5
            });
            console.log(`Map is flying to the athlete's city: ${city}, ${state}`);
        } else {
            console.warn("Geocoding failed to find athlete's city");
        }
    } catch (err) {
        console.error("Error during geocoding:", err);
    }

    console.log('Map rendering complete, loading screen hidden.');
});
