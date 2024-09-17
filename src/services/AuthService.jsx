import BaseService from "./BaseService";
class AuthService extends BaseService {
  constructor(axios, apiUrl) {
    super(axios, apiUrl);
  }

  login(data) {
    return this.axios({
      url: `${this.baseUrl}/auth/login`,
      method: "POST",
      headers: this.config.headers,
      data: data,
    });
  }
}

export default AuthService;
