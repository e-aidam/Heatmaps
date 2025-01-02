### `DESIGN.md` - Heatmaps Project Design Document

----------

### **Introduction**

The Heatmaps project is a web application designed to visualize a user’s running/cycling activity data fetched from Strava. It leverages Python, Flask, JavaScript, and web libraries to render an interactive map with activity heatmaps, enabling users to explore their training data spatially.

----------

### **Backend Design**

#### **Flask Application**

The backend uses Flask, a lightweight Python web framework, chosen for its simplicity and scalability. The backend serves three key functions:

1.  **Rendering Static Pages**:
    
    -   The Flask `render_template` method serves the HTML templates for the homepage (`index.html`) and the map view (`map.html`).
2.  **API Integration with Strava**:
    
    -   Strava’s API provides authenticated access to user data, requiring client credentials and a refresh token for authorization. The backend handles this process by:
        -   Sending a GET request via a unique client id, client secret, and refresh token to the Strava API.
        -   Using the tokens to fetch athlete information and activity data from `/api/v3/athlete` and `/api/v3/athlete/activities`.
    -   All data is relayed to the frontend as JSON via the `/api/map` endpoint.
3.  **Session Management**:
    
    -   Sessions are configured to store user states on the server’s filesystem. This avoids exposing sensitive data like tokens to the client.

#### **Design Choices**:

-   **Why Flask?** Flask was chosen for its ease of use and ability to integrate seamlessly with other Python libraries like `requests`. Its built-in templating engine simplifies HTML rendering.
-   **Stateless Design**: The API avoids retaining sensitive user data by making real-time requests to Strava, ensuring up-to-date data while adhering to best practices for API-driven applications.

----------

### **Frontend Design**

#### **HTML and CSS**

1.  **Templates**:
    
    -   `index.html`: Provides a landing page before exploring the heatmaps.
    -   `map.html`: Hosts the interactive map, where user activities are visualized.
2.  **Styling**:
    
    -   Bootstrap 5.3 is used for a responsive and modern UI.
    -   Custom styles enhance the user experience, e.g., preloading background images for faster rendering and ensuring the app has a professional aesthetic.

#### **Navigation**:

-   A navigation bar with an off-canvas menu allows users to switch map themes dynamically (e.g., light, dark, or topographic views).

----------

### **Mapping Features**

The map view is implemented using **Leaflet.js**, a popular JavaScript library for interactive maps.

#### **Core Features**:

1.  **Tile Layers**:
    
    -   Users can switch between `outdoors`, `dark`, and `topographic` themes using preconfigured tile layers.
    -   Themes are managed dynamically, ensuring smooth transitions without reloading the page.
2.  **Polyline Rendering**:
    
    -   Strava activities are represented as polylines, decoded from Strava’s compressed polyline format using the `decodePolyline` function.
    -   Polylines are grouped using `L.layerGroup` for efficient rendering and management.
3.  **Interactivity**:
    
    -   Clicking on a polyline highlights it, zooms to its bounds, and displays a popup with details like distance, duration, and a link to the full activity on Strava.
    -   The map includes a search feature (via Leaflet-Geosearch) for exploring locations.
4.  **Geocoding**:
    
    -   The athlete’s home city is used to center the map upon load, improving user familiarity.

----------

### **JavaScript Design**

The JavaScript code ensures seamless integration between the backend and the interactive map.

#### **Data Fetching**:

-   Activities and athlete data are fetched from the Flask API (`/api/map`) using `fetch`. The use of `async/await` simplifies asynchronous operations.

#### **Map Initialization**:

-   The map is initialized with a default zoom level and centered on the US. Layers and controls are added dynamically.

#### **Dynamic Theme Switching**:

-   Tile layers are defined for each theme and can be switched dynamically via event listeners attached to the HTML dropdown menu.

#### **Polyline Rendering**:

-   Polylines are dynamically added or cleared when the dataset changes. This approach ensures scalability when handling a large number of activities.

----------

### **Security Considerations**

1.  **Credential Management**:
    
    -   Strava API credentials (`CLIENT_ID`, `CLIENT_SECRET`) and the refresh token are stored in the backend and not exposed to the client.
2.  **Session Safety**:
    
    -   Server-side sessions prevent unauthorized access to sensitive tokens or states.

----------

### **Challenges and Solutions**

1.  **Efficient Data Handling**:
    
    -   Problem: Strava’s API paginates activity data, requiring multiple requests for larger datasets.
    -   Solution: The backend iterates through all pages and aggregates the data, returning it as a single JSON response.
2.  **Dynamic Theme Switching**:
    
    -   Problem: Switching themes required re-rendering the map without affecting existing polylines.
    -   Solution: Polylines are managed in a separate `L.layerGroup`, unaffected by tile layer changes.
3.  **Cross-Browser Compatibility**:
    
    -   Problem: Ensuring compatibility for interactive features like popups and dynamic layer switching.
    -   Solution: Used well-tested libraries (Leaflet, Bootstrap) and avoided browser-specific hacks.

----------

### **Future Enhancements**

1.  **Authentication**:
    -   Integrate OAuth2 login flow to allow users to link their own Strava accounts dynamically.
2.  **Performance Optimization**:
    -   Implement caching for activity data to reduce API calls.
3.  **Enhanced Analytics**:
    -   Add global heatmap overlays to visualize activity density.

