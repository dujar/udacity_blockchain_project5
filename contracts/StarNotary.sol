pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 { 

    struct Star {
        string name;
        string story;
        string dec;
        string mag;
        string cent;
        // StarCoordinates coordinates;
        
    }

    // struct StarCoordinates {
    //     string dec;
    //     string mag;
    //     string cent;
    // }

    mapping(bytes32 => bool)  public isStarCoordinates;
    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;

    function createStar(string _name, string _story, string _dec, string _mag, string _cent, uint256 _tokenId) public { 
        
        require(!checkIfStarExist(_dec, _mag, _cent), "apparently the coordinates already exists");
        
        require(bytes(_name).length != 0, "no name");

        require(bytes(_story).length != 0, "no story");

        require(_tokenId != 0, " no tokenId");

        Star memory newStar = Star(_name, _story, _dec, _mag, _cent);

        tokenIdToStarInfo[_tokenId] = newStar;

        _mint(msg.sender, _tokenId);
    }
    
    function mint(uint256 _tokenId) public {
        super._mint(msg.sender, _tokenId);
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public { 
        
        require(this.ownerOf(_tokenId) == msg.sender);

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable { 

        require(starsForSale[_tokenId] > 0);
        
        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);
        
        starOwner.transfer(starCost);

        if (msg.value > starCost) { 
            msg.sender.transfer(msg.value - starCost);
        }
    }
    
    function checkIfStarExist(string _dec, string _mag, string _cent) public view returns(bool) {
        return isStarCoordinates[generateHash(_dec, _mag, _cent)];
    }

    function generateHash(string _dec, string _mag, string _cent) internal pure returns(bytes32) {
        return keccak256(abi.encodePacked(_dec, _mag, _cent));
    }
}
