import React, { useState } from "react";
import { getEduStoreContract } from "../EduStore";
import { ethers } from "ethers";
import "./AddContent.css";

function AddContent({ signer, refreshContents }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

  const handleFileUpload = async () => {
    if (!file) return null;

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      return result.IpfsHash;
    } catch (error) {
      console.error("Error uploading file to IPFS:", error);
      return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!signer) {
      alert("Please connect your wallet first.");
      return;
    }

    setLoading(true);
    try {
      const cid = await handleFileUpload();
      if (!cid) {
        throw new Error("Failed to upload file to IPFS");
      }

      const edustore = getEduStoreContract(signer);
      const priceInWei = ethers.utils.parseUnits(price, "ether");
      const tx = await edustore.addContent(title, description, priceInWei, cid);
      await tx.wait();

      alert("Content added successfully!");
      setTitle("");
      setDescription("");
      setPrice("");
      setFile(null);
      toggleModal();
      if (refreshContents) {
        refreshContents();
      }
    } catch (error) {
      console.error("Error adding content:", error);
      alert("There was an error adding the content. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div>
      <button className="upload-btn" onClick={toggleModal}>
        UPLOAD +
      </button>
      {isOpen && (
        <div>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <form className="modal-content" onSubmit={handleSubmit}>
              <h2>Add New Content</h2>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price (in ETH):</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Upload File:</label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
              </div>
              <div className="modal-buttons">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "Adding Content..." : "Add Content"}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={toggleModal}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
          <div className="modal-overlay" onClick={toggleModal} />
        </div>
      )}
    </div>
  );
}

export default AddContent;
