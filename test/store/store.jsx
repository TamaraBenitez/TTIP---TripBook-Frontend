

import axios from "axios";
import TripService from "../../src/services/TripService";
import UserService from "../../src/services/UserService";
import AuthService from "../../src/services/AuthService";
import { vi } from "vitest";

const baseURL= import.meta.env.VITE_TRIPBOOK_API;
  axios.create = vi.fn();

export const store = {
    services: {
      tripService: new TripService(axios, baseURL),
      userService: new UserService(axios, baseURL),
      authService: new AuthService(axios, baseURL),
    },
};


