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

  register(data) {
    return this.axios({
      url: `${this.baseUrl}/auth/register`,
      method: "POST",
      headers: {...this.config.headers, 'Content-Type': 'multipart/form-data'},
      data: data
    });
  }

  sendVerificationEmail(data){
    return this.axios({
      url:`${this.baseUrl}/auth/send-verification-email`,
      method: "POST",
      headers: this.config.headers,
      data: data
    });
  }

  verifyEmail(token) {
    return this.axios({
      url:`${this.baseUrl}/auth/verify-email?token=${token}`,
      method: "GET",
      headers: this.config.headers
    });
  }

  verifyDni(data){
    return this.axios({
      url: `${this.baseUrl}/pdf417-decoder/decode`,
      method: "POST",
      headers: {...this.config.headers, 'Content-Type': 'multipart/form-data'},
      data: data
    });
  }
}

export default AuthService;
