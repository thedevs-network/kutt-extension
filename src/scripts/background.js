import axios from "axios";

async function getShortURL() {
  const API_key = "#";
  const URLtoShorten = "#";
  try {
    const rawData = await  axios({
        method: "POST",
        url:
          "https://cors-anywhere.herokuapp.com/https://kutt.it/api/url/submit",
        headers: { 'X-API-Key': API_key },
        data: { target: URLtoShorten }
      }
    );
    console.log(rawData.data.shortUrl);
  } catch (error) {
    console.log(error);
  }
}
getShortURL();
