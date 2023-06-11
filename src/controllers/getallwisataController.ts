import axios from 'axios';
import { Request, Response } from 'express';

export const getAllWisata = (req: Request, res: Response) => {
  const apiUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
  const { query } = req.query;
  const apiKey = process.env.API_KEY; // Replace with your actual API key

  // Include query parameters in the API request
  axios.get(apiUrl, {
    params: {
      query: query,
      key: apiKey
    }
  })
    .then(response => {
      // Handle the response data
      res.json(response.data);
    })
    .catch(error => {
      // Handle the error
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
};
