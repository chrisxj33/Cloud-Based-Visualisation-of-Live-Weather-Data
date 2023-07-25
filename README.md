# Cloud-Based Visualization of Live Weather Data"

Please be aware that the project is currently not operational due to the decommissioning of the Virtual Machine (VM). Nevertheless, the essential framework is preserved.

### Objectives
- Create a geospatial grid-based model of Victoria using the H3 Python library.
- Store the data on a PostgreSQL database with the PostGIS extension.
- Collect and integrate weather data into the database using the Open-Meteo API.
- Schedule the process of updating the database with new data every 24 hours.
- Publish the data on GeoServer for the maps access.
- Host the backend (database & scripts) on an a cloud VM using Azure.
- Develop an interactive map using Leaflet & JS for visualizing the weather data.
- Implement interactive features such as info pop-ups and layer resolution switching in the map interface.

### Summary
Summarizing the entire process, when a user clicks on the provided link, they are redirected to the web map. This map immediately
issues a data request to the Virtual Machine (VM) hosting GeoServer. Upon receiving this request, GeoServer retrieves live data
from the database and returns it to the map as a Web Feature Service (WFS). Extracting the geometry and attribute information, the
map builds the hexagonal grid system, complete with styling and functionality. Simultaneously, a scheduled Python script constantly
updates the database in the background. The culmination of this process is a user-friendly web map that offers live, daily
temperature data accessible round the clock, operating as a fully automated system.

### Framework

![image](https://github.com/chrisxj33/TemperatureGrid-Victoria/assets/53899548/d5916f06-3537-44a1-b3eb-2c0e22060db0)

### Skills Gained from Project

- **Geospatial Data Handling:** Developed skills in working with geospatial data, using tools like H3 Python library to create grid-based models. This includes understanding and manipulating data related to Earth's surface.
- **Database Management:** Gained experience with PostgreSQL and PostGIS extension, highlighting the ability to manage databases, particularly ones that deal with spatial data.
- **Data Integration:** Integrated external weather data using Open-Meteo API, showcasing the ability to handle and merge diverse data sources.
- **Automation:** Automated the process of updating the database with new data every 24 hours, showcasing skills in Python scripting and task automation.
- **Data Publishing and Sharing:** Utilized GeoServer to publish and share geospatial data, emphasizing the ability to disseminate data in an accessible format.
- **Cloud Management:** Hosted the backend on a cloud Virtual Machine (VM) using Azure, demonstrating understanding and management of cloud-based services.
- **Interactive Visualization:** Developed an interactive map using Leaflet for visualizing weather data, demonstrating abilities in data visualization and user interface design.
- **Interactive Feature Implementation:** Implemented interactive features such as pop-ups and layer switching in the map interface, proving the capacity to enhance user experience and interaction with data.
- **Full-stack Development:** Showcased full-stack development skills, with the ability to handle everything from database management, back-end and front-end development, to deploying the application.
- **Real-time Systems:** Designed and maintained a system that offers live, daily temperature data accessible round the clock, indicating skills in developing real-time systems.

### Results

![image](https://github.com/chrisxj33/TemperatureGrid-Victoria/assets/53899548/fc62b609-431a-46bd-add8-3842daece8df)
