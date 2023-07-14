# Grid Based Visualisation of Live Temperature Data

### Objectives
- Create a geospatial grid-based model of Victoria using the H3 Python library.
- Store the data on a PostgreSQL database with the PostGIS extension.
- Collect and integrate weather data into the database using Open-Meteo API.
- Automate the process of updating the database with new data every 24 hours.
- Publish the geospatial data on GeoServer for the maps access.
- Host the backend on an a cloud VM using Azure.
- Develop an interactive map using Leaflet for visualizing the weather data.
- Implement interactive features such as pop-ups and layer switching in the map interface.

### Summary
Summarizing the entire process, when a user clicks on the provided link, they are redirected to the web map. This map immediately
issues a data request to the Virtual Machine (VM) hosting GeoServer. Upon receiving this request, GeoServer retrieves live data
from the database and returns it to the map as a Web Feature Service (WFS). Using the geometry and attribute information, the
map builds the hexagonal grid system, complete with styling and functionality. Simultaneously, a scheduled Python script constantly
updates the database in the background. The culmination of this process is a user-friendly web map that offers live, daily
temperature data accessible round the clock, operating as a fully automated system.

### Framework
![image](https://github.com/chrisxj33/TemperatureGrid-Victoria/assets/53899548/d5916f06-3537-44a1-b3eb-2c0e22060db0)
