import BaseService from "./BaseService";

class VehicleService extends BaseService {
  constructor(axios, apiUrl) {
    super(axios, apiUrl);
  }
  
  GetVehicleData() {
    const publicAxios = this.axios.create()
    publicAxios.interceptors.request.use((config) => {
      if (config.url.includes('opendatasoft.com')) {
        delete config.headers.Authorization;
      }
      return config;
    });
    return publicAxios({
      url: "https://public.opendatasoft.com/api/records/1.0/search/?rows=7000&sort=modifiedon&start=1&fields=make,model,year&dataset=all-vehicles-model",
      method: "GET",
      headers: {
        Authorization: null
      }
    })
  }
  CreateVehicle(data) {
    return this.axios({
      url: `${this.baseUrl}/vehicles`,
      method: "POST",
      headers: this.config.headers,
      data: data
    });
  }

  GetVehiclesById(userId){
    return this.axios({
      url: `${this.baseUrl}/vehicles/owner/${userId}`,
      method: "GET",
      headers: this.config.headers,
    });
  }

  
}

export default VehicleService;
