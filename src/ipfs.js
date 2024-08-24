const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;

const uploadToIPFS = async (file) => {
  const formData = new FormData();
  formData.append("file", file.buffer, file.originalname); // file.buffer kullanımı, dosyanın içeriğini doğrudan formData'ya eklemek için

  try {
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error uploading file to IPFS:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

module.exports = { uploadToIPFS };
