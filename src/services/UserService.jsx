import BaseService from "./BaseService";

class UserService extends BaseService {
  constructor(axios, apiUrl) {
    super(axios, apiUrl);
  }

  GetMyTrips(id) {
    return this.axios({
      url: `${this.baseUrl}/tripUser/${id}/trips`, //harcode test user
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

  UpdateUser(id,user){
    return this.axios({
      url: `${this.baseUrl}/user/verify/${id}`,
      method: "PATCH",
      headers: this.config.headers,
      data: user
    })
  }
}

export default UserService;
