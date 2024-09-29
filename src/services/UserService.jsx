import BaseService from "./BaseService";

class UserService extends BaseService {
  constructor(axios, apiUrl) {
    super(axios, apiUrl);
  }

  GetMyTrips() {
    return this.axios({
      url: `${this.baseUrl}/tripUser/testid1/trips`, //harcode test user
      method: "GET",
      headers: this.config.headers,
    });
  }

  GetUser(id) {
    return this.axios({
      url: `${this.baseUrl}/user/${id}`,
      method: "GET",
      headers: this.config.headers,
    });
  }
}

export default UserService;
