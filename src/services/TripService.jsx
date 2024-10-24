import dayjs from "dayjs";
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

    GetTrip(id){
        return this.axios({
            url: `${this.baseUrl}/trip/${id}`,
            method: "GET",
            headers: this.config.headers
        });
    }

    RegisterUserToTrip(userId, tripId) {
        return this.axios({
            url: `${this.baseUrl}/tripUser`,
            method: "POST",
            headers: this.config.headers,
            data: {
                userId:userId,
                tripId:tripId,
                status: "pending",
                role:"passenger",
                joinDate:dayjs()
            }
        });
    }

    CreateTrip(tripData){
        return this.axios({
            url: `${this.baseUrl}/trip`,
            method: "POST",
            headers: this.config.headers,
            data:tripData
        })
    }
}

export default TripService;