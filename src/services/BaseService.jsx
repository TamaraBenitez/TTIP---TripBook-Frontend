class BaseService {
    constructor(axios, apiUrl) {
        this.axios = axios;
        this.baseUrl = apiUrl;
        this.config = {
            headers: {
                'Access-Control-Allow-Origin': "*"
            }
        };
    }
}

export default BaseService;