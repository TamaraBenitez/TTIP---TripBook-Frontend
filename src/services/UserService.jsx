import BaseService from "./BaseService";

class UserService extends BaseService {
    constructor(axios, apiUrl){
        super(axios, apiUrl);
    }

    GetMyTrips() {
        return this.axios({
            url: `${this.baseUrl}/user/mytrips?userid=testid1`, //harcode test user
            method: "GET",
            headers: this.config.headers
        });
    };

}

export default UserService;