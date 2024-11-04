export const uploadSensorData = async (file: File) => {
    const token = localStorage.getItem('access_token');

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:8000/sensor-data/update-values/', {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!response.ok) {
         if(response.status == 401) {
            throw new Error("User not authorized, please login and try again.");
        } else {
            throw new Error("Failed to upload sensor readings.");
        }
    }

    return await response.json();
};