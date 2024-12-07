import BaseService from "./BaseService";

class UserService extends BaseService {
  constructor(axios, apiUrl) {
    super(axios, apiUrl);
  }

  GetMyTrips(id, role, filters = {}) {
    return this.axios({
      url: `${this.baseUrl}/tripUser/${id}/trips`,
      method: "GET",
      headers: this.config.headers,
      params: {
        role,
        ...filters,
      },
    });
  }

  GetUser(id) {
    return this.axios({
      url: `${this.baseUrl}/user/${id}`,
      method: "GET",
      headers: this.config.headers,
    });
  }

  UpdateVerifiedDataUser(id, user) {
    return this.axios({
      url: `${this.baseUrl}/user/verify/${id}`,
      method: "PATCH",
      headers: this.config.headers,
      data: user,
    });
  }
  UpdateUser(id, userData) {
    return this.axios({
      url: `${this.baseUrl}/user/update/${id}`,
      method: "PATCH",
      headers: this.config.headers,
      data: userData,
    });
  }
}

export default UserService;
