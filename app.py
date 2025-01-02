import requests
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

from flask import Flask, jsonify, render_template
from flask_session import Session

# Strava App Credentials
CLIENT_ID = "141251"
CLIENT_SECRET = "aaa79d5d3addc6e7c97d9f8bf097af854f78edb2"

# Configure application
app = Flask(__name__)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/map')
def map():
    return render_template("map.html")

@app.route('/api/map', methods=['GET'])
def get_activities():
    # Strava API URLs
    auth_url = "https://www.strava.com/oauth/token"
    athlete_url = "https://www.strava.com/api/v3/athlete"
    activities_url = "https://www.strava.com/api/v3/athlete/activities"

    # Payload for authentication
    payload = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "refresh_token": "b1b2ad07f4c54f8f6bb5e8df3cad0a05edf084c5",
        "grant_type": "refresh_token",
    }

    try:
        # Request access token
        auth_response = requests.post(auth_url, json=payload)
        auth_response.raise_for_status()
        auth_data = auth_response.json()
        access_token = auth_data.get("access_token")

        if not access_token:
            return jsonify({"error": "Failed to retrieve access token"}), 400

        headers = {"Authorization": f"Bearer {access_token}"}

        # Fetch athlete information
        athlete_response = requests.get(athlete_url, headers=headers)
        athlete_response.raise_for_status()
        athlete = athlete_response.json()

        # Fetch all activities
        all_activities = []
        page = 1
        while True:
            params = {"per_page": 200, "page": page}
            activities_response = requests.get(activities_url, headers=headers, params=params)
            activities_response.raise_for_status()
            activities = activities_response.json()

            if not activities:
                break  # No more activities

            all_activities.extend(activities)
            page += 1
            
        return jsonify({"athlete": athlete, "activities": all_activities})
    except requests.RequestException as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
