const express = require("express");
const multer = require("multer");
const { uploadToIPFS } = require("./ipfs");
const cors = require("cors");

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const upload = multer();

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const ipfsResult = await uploadToIPFS(file);
    res.status(200).json(ipfsResult);
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);
    res.status(500).json({ error: "Failed to upload file to IPFS" });
  }
});

app.get("/download/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const downloadUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;
    res.redirect(downloadUrl); // Dosyayı IPFS üzerinden indirmek için kullanıcıyı yönlendirin
  } catch (error) {
    console.error("Error downloading file from IPFS:", error);
    res.status(500).json({ error: "Failed to download file from IPFS" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
