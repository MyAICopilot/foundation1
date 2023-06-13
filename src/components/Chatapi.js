// api.js
import axios from "axios";

export const sendMessageToServer = async (message) => {
  try {
    // const response = await axios.post(
    //   "http://localhost:3010",
    // {
    const response = await axios.post(
      "https://intense-oasis-44220.herokuapp.com",
      {
        message: message,
      }
    );

    return response.data.completion.content;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// import axios from "axios";
// const API_KEY = "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";

// const instance = axios.create({
//   baseURL: "https://api.openai.com/v1/chat/completions",
//   headers: { Authorization: `Bearer ${API_KEY}` },
// });

// export const sendMessageToServer = async (message) => {
//   try {
//     const response = await instance.post("", {
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "system",
//           content: "You are a helpful assistant.",
//         },
//         {
//           role: "user",
//           content: message,
//         },
//       ],
//     });
//     return response.data.choices[0].message.content;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };
