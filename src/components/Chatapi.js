// api.js
import axios from "axios";

export const sendMessageToServer = async (message) => {
  try {
    const response = await axios.post("http://localhost:3010", {
      message: message,
    });

    return response.data.completion.content;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
