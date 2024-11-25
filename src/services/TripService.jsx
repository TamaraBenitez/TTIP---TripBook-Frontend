import BaseService from "./BaseService";
class TripService extends BaseService {
  constructor(axios, apiUrl) {
    super(axios, apiUrl);
  }

  GetAllTrips(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return this.axios({
      url: `${this.baseUrl}/trip?${params}`,
      method: "GET",
      headers: this.config.headers,
    });
  }

  GetTrip(id) {
    return this.axios({
      url: `${this.baseUrl}/trip/${id}`,
      method: "GET",
      headers: this.config.headers,
    });
  }

  GetPendingPassengers(id) {
    return this.axios({
      url: `${this.baseUrl}/trip/driver/${id}/pendingPassengers`,
      method: "GET",
      headers: this.config.headers,
    });
  }

  RegisterUserToTrip(data) {
    return this.axios({
      url: `${this.baseUrl}/tripUser/createRegistrationWithOtherCoordinates`,
      method: "POST",
      headers: this.config.headers,
      data: data,
    });
  }

  RejectRequest(tripUserId, data) {
    return this.axios({
      url: `${this.baseUrl}/tripUser/rejectRequest/${tripUserId}`,
      method: "POST",
      headers: this.config.headers,
      data: data,
    });
  }

  AcceptRequest(tripUserId) {
    return this.axios({
      url: `${this.baseUrl}/tripUser/acceptRequest/${tripUserId}`,
      method: "POST",
      headers: this.config.headers,
    });
  }

  CancelRequest(tripUserId) {
    return this.axios({
      url: `${this.baseUrl}/tripUser/cancelRequest/${tripUserId}`,
      method: "POST",
      headers: this.config.headers,
    });
  }

  CreateTrip(tripData) {
    return this.axios({
      url: `${this.baseUrl}/trip`,
      method: "POST",
      headers: this.config.headers,
      data: tripData,
    });
  }

  GetRequest(tripUserId, tripId) {
    return this.axios({
      url: `${this.baseUrl}/tripUser/requestDetails/${tripUserId}/${tripId}`,
      method: "GET",
      headers: this.config.headers,
    });
  }

  GetImagesUrls() {
    return this.axios({
      url: `${this.baseUrl}/trip/imagesUrls`,
      method: "GET",
      headers: this.config.headers,
    });
  }
}

export default TripService;
