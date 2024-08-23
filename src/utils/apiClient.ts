import axios from "axios";

export function apiPostRequest(path: string, params?: object) {
  const lichessApi = "lip_1PxEoSykBCqOIAXnLVXc";

  return axios.post("https://lichess.org" + path, params, {
    headers: {
      Authorization: `Bearer ${lichessApi}`
    }
  });
}
