import axios from "axios";

export function apiPostRequest(path: string) {
  const lichessApi = "lip_1PxEoSykBCqOIAXnLVXc";

  axios.post(
    "https://lichess.org" + path,
    {},
    {
      headers: {
        Authorization: `Bearer ${lichessApi}`
      }
    }
  );
}
