import React, { useState, useEffect } from "react";
import provider from "./ethers"; // Ethers.js dosyasını import ediyoruz
import ContentList from "./components/ContentList"; // ContentList bileşenini import ediyoruz
import AddContent from "./components/AddContent"; // AddContent bileşenini import ediyoruz
import { getEduStoreContract } from "./EduStore"; // EduStore kontratını import ediyoruz
import "./App.css"; // CSS dosyasını import ediyoruz

function App() {
  const [account, setAccount] = useState("");
  const [signer, setSigner] = useState(null);
  const [contents, setContents] = useState([]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        if (accounts.length > 0) {
          handleAccountsChanged(accounts);
        }
      });

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("disconnect", handleDisconnect);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("disconnect", handleDisconnect);
      }
    };
  }, []);

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length > 0) {
      const signer = provider.getSigner();
      const accountAddress = accounts[0];
      setSigner(signer);
      setAccount(accountAddress);
      console.log("Connected account:", accountAddress);
      fetchContents(signer);
    } else {
      setAccount("");
      setSigner(null);
    }
  };

  const handleDisconnect = () => {
    setAccount("");
    setSigner(null);
  };

  const fetchContents = async (signer) => {
    if (signer) {
      try {
        const edustore = getEduStoreContract(signer);
        const contentCount = await edustore.getContentCount();
        const contentArray = [];
        for (let i = 0; i < contentCount; i++) {
          const content = await edustore.getContent(i);
          contentArray.push(content);
        }
        setContents(contentArray);
      } catch (error) {
        console.error("Error fetching contents:", error);
      }
    }
  };

  const connectWallet = async () => {
    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      handleAccountsChanged(accounts);
    } catch (err) {
      console.error("User denied account access:", err);
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-brand">EduStore</div>
        <div className="navbar-content">
          {account ? (
            <p
              className="account-info"
              onClick={handleDisconnect}
              style={{ cursor: "pointer" }}
            >
              Connected: {account}
            </p>
          ) : (
            <button className="btn btn-primary" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      <div className="main-content">
        {account ? (
          <>
            <AddContent
              signer={signer}
              refreshContents={() => fetchContents(signer)}
            />
            <ContentList signer={signer} contents={contents} />
          </>
        ) : (
          <div className="connect-prompt">
            <h2>Please connect your wallet to continue</h2>
            <button className="btn btn-primary" onClick={connectWallet}>
              Connect Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
