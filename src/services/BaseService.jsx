class BaseService {
    constructor(axios, apiUrl) {
        this.axios = axios;
        this.baseUrl = apiUrl;
        this.config = {
            headers: {}
        };
    }
}

export default BaseService;