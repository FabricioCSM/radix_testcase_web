export interface GetSensorReadingsResponse {
    sensorReadings: {
      equipment_id: string
      timestamp: string
      value: number
    }[]
  }
  
  export async function getAllSensorReadings(): Promise<GetSensorReadingsResponse> {
    const token = localStorage.getItem('access_token');

    const response = await fetch('http://localhost:8000/sensor-data/all', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status == 500) {
          throw new Error("Failed to fetch sensor readings statistics.");
      } if(response.status == 401) {
          throw new Error("User not authorized, please login and try again.");
      } else {
          throw new Error("Error while fetching sensor readings statistics.");
      }
    }

    const data = await response.json()
  
    return data
  }

  export async function getSensorReadingsByEquipmentId(equipment_id: string): Promise<GetSensorReadingsResponse> {
    const token = localStorage.getItem('access_token');

    const response = await fetch(`http://localhost:8000/sensor-data/${equipment_id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status == 500) {
          throw new Error("Failed to fetch sensor readings statistics.");
      } if(response.status == 401) {
          throw new Error("User not authorized, please login and try again.");
      } else {
          throw new Error("Error while fetching sensor readings statistics.");
      }
    
    }
    const data = await response.json()
  
    return data
  }
  