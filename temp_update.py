# update sql database with new temperature data

import requests
import psycopg2
from h3 import h3
from getpass import getpass
import concurrent.futures

# Connect to the PostgreSQL database
conn = psycopg2.connect(
    dbname="cloudbased_project",
    user="postgres",
    password="admin",
    host="localhost",
    port="5433"
)

def update_layer(layer):
    # Get a cursor object
    cur = conn.cursor()

    # Execute the SQL command to retrieve the layer
    cur.execute(f"SELECT * FROM {layer}")

    # Fetch all the rows
    rows = cur.fetchall()

    def get_temperature(row):
        
        # Locate H3 index row
        h3_index = row[1]
        
        # Convert the H3 index to latitude and longitude
        lat, lon = h3.h3_to_geo(h3_index)

        # Call the open-meteo.com API
        response = requests.get(f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=temperature_2m_max&forecast_days=1&timezone=Australia%2FSydney")
        
        # Check if the request was successful
        if response.status_code == 200:
            data = response.json()

            # extract the temperature from the returned data
            temperature = data['daily']['temperature_2m_max'][0]
            return temperature
    
    # Use a ThreadPoolExecutor to execute the API calls in parallel
    with concurrent.futures.ThreadPoolExecutor() as executor:
    
        # Map the executor onto the function to get the weather code for each row
        futures = {executor.submit(get_temperature, row): row for row in rows}

        updates = []
        count = 0
        
        for future in concurrent.futures.as_completed(futures):
            row = futures[future]
            h3_index = row[1]
            try:

                # Get the result of the future
                temperature = future.result()
                
                updates.append((temperature, h3_index))
                print(f"Iteration {count}: Added temperature data successfuly for {h3_index}")
                count = count + 1

            except Exception as e:
                print(f"Error getting temperature for {h3_index}: {e}")

    # perform bulk update
    cur.executemany(f"UPDATE {layer} SET temperature = %s WHERE index = %s", updates)
    
    # Commit the changes and close the connection
    conn.commit()
    print(f"Update complete for layer {layer}")

# Update all the layers
update_layer("grid_res_6")
update_layer("grid_res_5")
update_layer("grid_res_4")

conn.close()
print("Operation complete")

