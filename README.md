# README.md: Heatmaps

  

  

## Project Overview

  

  

Welcome to **Heatmaps**! This project is a web application that uses Flask (Python) on the backend, with HTML, CSS, and JavaScript on the frontend to visualize Strava activities on an interactive map. In its current version, users can view Ethan Aidam's past Strava activities, complete with route details, activity statistics, and customizable map themes.

  

---

  

  

## Features

  

  

-  **Interactive Map**: View your activities as polylines on a map.

  

-  **Dynamic Themes**: Switch between various map themes like outdoors, dark mode, and topographic.

  

-  **Activity Details**: See details like activity name, distance, and duration by clicking on a route.

  

-  **Geosearch**: Search for specific locations on the map.

  

-  **Athlete Overview**: Automatically zooms to the athlete's home city based on Strava data.

  

  

---

  

  

## Prerequisites

  

  

  

-  **Python 3.8+**

  

-  **pip (Python Package Installer)**

  

  

---

  

  

## Installation and Setup

  
  
  

### Step 1: Install Python Dependencies

  

Use `pip` to install required libraries:

  

```bash

  

pip  install  -r  requirements.txt

  

```

  

The project uses Leaflet.js and other libraries via CDN. No additional installation is required for these libraries.

  

  

### Step 2: Run the Application

  

Launch the Flask app:

  

```bash

  

python  app.py

  

```

  

The application will be accessible at `http://127.0.0.1:5000`. As long as the application is run via a development server accessed via `localhost` or `127.0.0.1`, no Stadia Maps API key is necessary.

  

  

---

  

  

## File Structure

  

  

```

  

project/

  

│

  

├── app.py # Flask backend

  

├── static/ # Static files (CSS, JavaScript, images)

  

│ ├── styles.css # Custom styles

  

│ ├── map1-5.jpg/png # Images on home page

  

│ └── strava_mapper.js # Main JavaScript logic

  

├── templates/ # HTML templates

  

│ ├── index.html # Home page

  

│ └── map.html # Map view

  

└── requirements.txt # Python dependencies

  

```

  

  

---

  

  

## Usage

  

  

### Accessing the Application

  

1. Open your browser and navigate to `http://127.0.0.1:5000`.

  

2. You will see the homepage with a "Enter Heatmaps" button to view your activities.

  

  

### Exploring the Map

  

1. The map initially centers on the United States.

  

2. Once data is fetched, the map will zoom to the athlete's home location.

  

3. Activities are displayed as polylines. Click on any route to see details.

  

  

### Switching Map Themes

  

1. From the menu, use the theme switcher to toggle between:

  

-  **Outdoors**

  

-  **Dark Mode**

  

-  **Topographic**

  

  

### Searching for Locations

  

1. Use the search bar to find specific places or addresses on the map.

  

  

---

  

  

### Q: How do I add new themes or map layers?

  

1. Modify the `tileLayers` object in `scripts.js` to add a new tile URL.

  

2. Ensure proper attribution for the tile provider.

  

  

### Q: How can I debug API errors?

  

1. Open the browser console (`F12` > Console).

  

2. Look for error messages related to fetching activities.

  

3. Check the Flask logs in your terminal for backend errors.

  

  

---

  

  

## Troubleshooting

  

  

-  **Error: "Failed to fetch activities data"**

  

Ensure Strava API credentials are valid and the server has internet access.

  

  

-  **Map does not render**

  

Ensure all Leaflet.js CDN links in `map.html` are accessible.

  

  

-  **Geosearch fails**

  

Verify that the OpenStreetMap provider is reachable and the athlete's city/state data is correct.

  

  

---

  

  

## Credits

  

  

-  **Leaflet.js**: Interactive map rendering.

  

-  **Flask**: Backend framework.

  

-  **Stadia Maps & OpenStreetMap**: Map tiles.

  

  

---

  

## Video Breakdown

  See a video breakdown of Heatmaps from the Youtube link below.

[Heatmaps: CS50 Final Project](https://www.youtube.com/watch?v=a-BCQkuSGDY&ab_channel=EthanAidam)

  

Happy exploring! 🚴‍♂️🌍s
