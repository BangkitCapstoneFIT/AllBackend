import { Request, Response } from "express";
import axios from 'axios';

export const wisataJawa = (req: Request, res: Response) => {
    const apiUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
    const { island } = req.params; // Extract the island parameter from the request
    const apiKey = process.env.API_KEY; // Replace with your actual API key
  
    // Include query parameters in the API request
    axios
      .get(apiUrl, {
        params: {
          query: `tourism spot in ${island} island Indonesia`, // Use the island parameter in the query
          key: apiKey,
        },
      })
      .then((response) => {
        // Handle the response data
        res.json(response.data);
      })
      .catch((error) => {
        // Handle the error
        console.error(error);
        res.status(500).send('Internal Server Error');
      });
  };

  