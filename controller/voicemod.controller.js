import WebSocket from "ws";
import dotenv from "dotenv";
dotenv.config();
export const getSoundBoards = async (req, res) => {
  try {
    const soundboards = await new Promise((resolve, reject) => {
      const socket = new WebSocket("ws://localhost:59129/v1");

      socket.onopen = () => {
        console.log("[open] Connection established");

        socket.send(
          JSON.stringify({
            id: "ff7d7f15-0cbf-toto-bc31-b56e0a6c9fa6",
            action: "registerClient",
            payload: {
              clientKey: process.env.VOICEMOD_API_KEY,
            },
          })
        );

        socket.send(
          JSON.stringify({
            id: "getMySB",
            action: "getAllSoundboard",
            payload: {},
          })
        );
      };

      socket.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (response.actionID === "getMySB") {
          resolve(response.actionObject.soundboards);
          socket.close();
        }
      };

      socket.onerror = (error) => {
        reject(`WebSocket error: ${error.message}`);
      };

      socket.onclose = () => {
        console.log("[close] Connection closed");
      };
    });

    const result = soundboards.find((sb) => sb.name === "My soundboard");

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const playSoundById = async (req, res) => {
  const { id } = req.params;
  try {
    const soundboards = await new Promise((resolve, reject) => {
      const socket = new WebSocket("ws://localhost:59129/v1");

      socket.onopen = () => {
        console.log("[open] Connection established");

        socket.send(
          JSON.stringify({
            id: "ff7d7f15-0cbf-toto-bc31-b56e0a6c9fa6",
            action: "registerClient",
            payload: {
              clientKey: process.env.VOICEMOD_API_KEY,
            },
          })
        );

        // jouer un son
        socket.send(
          JSON.stringify({
            id: "playSbMeme",
            action: "playMeme",
            payload: {
              FileName: id,
              IsKeyDown: true,
            },
          })
        );
      };

      socket.onmessage = (event) => {
        const response = JSON.parse(event.data);
        // Vérifier si c'est la réponse à playSbMeme
        if (response.actionID === "playSbMeme") {
          resolve(); // Résoudre la promesse SEULEMENT ici
          socket.close();
        }
      };

      setTimeout(() => {
        reject("Timeout: Aucune réponse du serveur WebSocket après 5s");
      }, 5000);
    });
    res.status(200).json({ success: true, message: "Son joué avec succès" });
  } catch (error) {
    console.log("🚀 ~ playSoundById ~ error:", error);
    res.status(500).json({ success: false, message: error });
  }
};

// let socket = new WebSocket("ws://localhost:59129/v1");

// socket.onopen = function (e) {
//   console.log(e + "[open] Connection established");
//   console.log("Sending to server");

//   socket.send(
//     JSON.stringify({
//       id: "ff7d7f15-0cbf-toto-bc31-b56e0a6c9fa6",
//       action: "registerClient",
//       payload: {
//         clientKey: process.env.VOICEMOD_API_KEY,
//       },
//     })
//   );

//   // recup les donnes des soundboard
//   socket.send(
//     JSON.stringify({
//       id: "getMySB",
//       action: "getAllSoundboard",
//       payload: {},
//     })
//   );

// recup les sons des soundboards
// socket.send(
//   JSON.stringify({
//     id: "getSbMeme",
//     action: "getMemes",
//     payload: {
//       FileName: "Bruuh",
//       IsKeyDown: true,
//     },
//   })
// );

// jouer un son
// socket.send(
//   JSON.stringify({
//     id: "playSbMeme",
//     action: "playMeme",
//     payload: {
//       FileName: "b181ab2d-0bb7-4e32-b4d7-fda25cb53a37",
//       IsKeyDown: true,
//     },
//   })
// );
// };

// socket.onmessage = function (event) {
//   let mySb;
//   const response = JSON.parse(event.data);
//   if (response) {
//     console.log("✅ réponse reçu " + response.actionID);
//   }

//   if (response.actionID === "getMySB") {
//     const soundboards = response.actionObject.soundboards;
//     for (const sb of soundboards) {
//       if (sb.name === "My soundboard") {
//         mySb = sb;
//         break;
//       }
//     }
//     console.log(mySb);
//   }

//   if (response.actionId === "getSbMeme") {
//     const res = JSON.parse(event.data);
//     for (const meme of res.actionObject.listOfMemes) {
//       const mysb = meme.Name.split("-");
//       if (mysb[0] === "mysb") {
//         console.log(meme);
//       }
//     }
//   }
//   if (response.actionID === "playSbMeme") {
//     console.log(event.data);
//   }
// };
