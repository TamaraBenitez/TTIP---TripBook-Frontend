import BaseService from "./BaseService";
import data from '../data.json';

class TripService extends BaseService {
    constructor(axios, apiUrl){
        super(axios, apiUrl);
    }
    
    GetAllTrips() {
        // return this.axios({
        //     url: `${this.baseUrl}/trips`,
        //     method: "GET",
        //     headers: this.config.headers
        // });
        return data;
    };
}

export default TripService;