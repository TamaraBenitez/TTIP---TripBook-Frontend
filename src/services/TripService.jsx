import BaseService from "./BaseService";

class TripService extends BaseService {
    constructor(axios, apiUrl){
        super(axios, apiUrl);
    }
    
    GetAllTrips() {
        return this.axios({
            url: `${this.baseUrl}/trip`,
            method: "GET",
            headers: this.config.headers
        });
    };
}

export default TripService;