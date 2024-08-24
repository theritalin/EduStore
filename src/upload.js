const fs = require("fs");
const { create } = require("ipfs-http-client");

// IPFS client'ı başlatıyoruz
const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

async function uploadFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath); // Dosya içeriğini okuyun

    // Dosyayı IPFS'ye yükleyin
    const result = await ipfs.add(fileContent);

    return { cid: result.path };
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);
    throw new Error("Failed to upload file to IPFS");
  }
}

module.exports = uploadFile;
