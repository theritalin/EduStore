// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EduStore {
    // İçerik yapısı
    struct Content {
        uint id;
        string title;
        string description;
        address payable author;
        uint price;
        string cid; // IPFS hash değeri
    }

    // İçerik listesini tutmak için bir array
    Content[] public contents;

    // İçerik ID'sini takip etmek için bir sayaç
    uint public nextContentId;

    // Kullanıcıların satın aldıkları içerikleri takip etmek için mapping
    mapping(uint => mapping(address => bool)) public purchases;

    // İçerik eklendiğinde tetiklenen event
    event ContentAdded(uint id, string title, address author, uint price);

    // İçerik satın alındığında tetiklenen event
    event ContentPurchased(uint id, address buyer);

    // Yeni içerik eklemek için fonksiyon
    function addContent(
        string memory _title,
        string memory _description,
        uint _price,
        string memory _cid
    ) public {
        contents.push(
            Content({
                id: nextContentId,
                title: _title,
                description: _description,
                author: payable(msg.sender),
                price: _price,
                cid: _cid
            })
        );
        emit ContentAdded(nextContentId, _title, msg.sender, _price);
        nextContentId++;
    }

    // İçerik satın almak için fonksiyon
    function purchaseContent(uint _id) public payable {
        require(_id < contents.length, "Icerik bulunamadi.");
        Content memory content = contents[_id];
        require(msg.value >= content.price, "Yeterli miktar gonderilmedi.");
        require(!purchases[_id][msg.sender], "Bu icerik zaten satin alindi.");

        // Yazarın hesabına ödemeyi aktar
        content.author.transfer(msg.value);

        // Kullanıcının bu içeriği satın aldığını kaydet
        purchases[_id][msg.sender] = true;

        emit ContentPurchased(_id, msg.sender);
    }

    // Belirli bir kullanıcının belirli bir içeriği satın alıp almadığını kontrol eden fonksiyon
    function isPurchased(uint _id, address _user) public view returns (bool) {
        require(_id < contents.length, "Icerik bulunamadi.");
        return purchases[_id][_user];
    }

    // İçeriklerin sayısını almak için fonksiyon
    function getContentCount() public view returns (uint) {
        return contents.length;
    }

    // Belirli bir içerik hakkında bilgi almak için fonksiyon
    function getContent(
        uint _id
    )
        public
        view
        returns (
            uint,
            string memory,
            string memory,
            address,
            uint,
            string memory
        )
    {
        require(_id < contents.length, "Icerik bulunamadi.");
        Content memory content = contents[_id];
        return (
            content.id,
            content.title,
            content.description,
            content.author,
            content.price,
            content.cid
        );
    }
}
