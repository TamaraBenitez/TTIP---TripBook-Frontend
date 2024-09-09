import BaseService from "./BaseService";
import mytrips from "../../mockedTrips.json"
import trip from "../../exampleTrip.json";
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
    GetMyTrips() {
        // return this.axios({
        //     url: `${this.baseUrl}/mytrips`,
        //     method: "GET",
        //     headers: this.config.headers
        // });
        return mytrips;
    };
    GetTrip(id){
        // return this.axios({
        //     url: `${this.baseUrl}/trip/${id}`,
        //     method: "GET",
        //     headers: this.config.headers
        // });
        return trip;
    }
}

export default TripService;