export interface SensorStatistics {
    average: number;
    minimum: number;
    maximum: number;
    count: number;
}

export interface EquipmentStatisticsResponse {
    equipment_id: string;
    statistics: SensorStatistics;
}

export async function getReadingsStatistics(
    time_period: number, 
    equipment_id?: string
): Promise<EquipmentStatisticsResponse[]> {
    const token = localStorage.getItem('access_token');

    const url = equipment_id
      ? `http://localhost:8000/sensor-data/statistics/${time_period}?equipment_id=${equipment_id}`
      : `http://localhost:8000/sensor-data/statistics/${time_period}`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
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

    const data = await response.json();
    return data;
}