import React, { useState, useEffect } from "react";
import { getEduStoreContract } from "../EduStore";
import { ethers } from "ethers";

import "./ContentList.css";

function ContentList({ signer }) {
  const [contents, setContents] = useState([]);
  const [purchasedContentIds, setPurchasedContentIds] = useState([]);



  useEffect(() => {
    async function fetchContents() {
      if (signer) {
        try {
          const edustore = getEduStoreContract(signer);
          const contentCount = await edustore.getContentCount();
          const contentArray = [];
          const purchasedIds = [];
          const userAddress = await signer.getAddress();

          for (let i = 0; i < contentCount; i++) {
            const contentData = await edustore.getContent(i);

            const content = {
              id: contentData[0].toNumber(),
              title: contentData[1],
              description: contentData[2],
              author: contentData[3],
              price: contentData[4],
              cid: contentData[5],
            };

            const isPurchased = await edustore.isPurchased(i, userAddress);
            if (isPurchased) {
              purchasedIds.push(content.id);
            }
            contentArray.push(content);
          }

          setContents(contentArray);
          setPurchasedContentIds(purchasedIds);
        } catch (error) {
          console.error("Error fetching contents:", error);
        }
      }
    }

    fetchContents();
  }, [signer]);

  const handlePurchase = async (index, price) => {
    if (!signer) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const edustore = getEduStoreContract(signer);
      const tx = await edustore.purchaseContent(index, { value: price });
      await tx.wait();
      alert("Content purchased successfully!");
      setPurchasedContentIds([...purchasedContentIds, index]);
    } catch (error) {
      console.error("Error purchasing content:", error);
      alert("There was an error purchasing the content. Please try again.");
    }
  };

  const handleDownload = (cid) => {
    const downloadUrl = `http://localhost:4000/download/${cid}`;
    window.open(downloadUrl, "_blank");
  };

  return (
    <div className="content-list">
      <h2>Purchased Contents</h2>
      <div className="row">
        {purchasedContentIds.length > 0 ? (
          contents
            .filter((content) => purchasedContentIds.includes(content.id))
            .map((content, index) => (
              <div key={index} className="col-md-4">
                <div className="card content-card">
                  <div className="card-body">
                    <h5 className="card-title">{content.title}</h5>
                    <p className="card-text">{content.description}</p>
                    <p className="card-price">
                      Price:{" "}
                      {content.price && content.price !== "0"
                        ? ethers.utils.formatEther(content.price)
                        : "N/A"}{" "}
                      ETH
                    </p>
              
                    <button
                      className="btn btn-success"
                      onClick={() => handleDownload(content.cid)}
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <p>No purchased contents available.</p>
        )}
      </div>

      <h2>Available Contents</h2>
      <div className="row">
        {contents.length > 0 ? (
          contents.map((content, index) => (
            <div key={index} className="col-md-4">
              <div className="card content-card">
                <div className="card-body">
                  <h5 className="card-title">{content.title}</h5>
                  <p className="card-text">{content.description}</p>
                  <p className="card-price">
                    Price:{" "}
                    {content.price && content.price !== "0"
                      ? ethers.utils.formatEther(content.price)
                      : "N/A"}{" "}
                    ETH
                  </p>
                  <p className="card-author">
                    Uploaded by: {content.author ? content.author : "Unknown"}
                  </p>
            
                  {purchasedContentIds.includes(content.id) ? (
                    <button
                      className="btn btn-success"
                      onClick={() => handleDownload(content.cid)}
                    >
                      Download
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => handlePurchase(content.id, content.price)}
                    >
                      Purchase
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No contents available.</p>
        )}
      </div>
    </div>
  );
}

export default ContentList;
