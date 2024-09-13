import axios from "axios";

export function apiPostRequest(path: string, params?: object) {
  const lichessBaseUrl = import.meta.env.VITE_LICHESS_BASE_URL;
  const lichessApi = import.meta.env.VITE_LICHESS_API_KEY;

  return axios.post(lichessBaseUrl + path, params, {
    headers: {
      Authorization: `Bearer ${lichessApi}`
    }
  });
}
