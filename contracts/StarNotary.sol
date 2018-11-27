pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

contract StarNotary is ERC721 { 

    struct Star {
        string name;
        StarCoordinates coordinates;
        string story;
    }

    struct StarCoordinates {
        string dec;
        string mag;
        string cent;
    }

    mapping(bytes32 => bool)  public isStarCoordinates;

    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;

    function createStar(string _name, string _dec, string _mag, string _cent, string _story, uint256 _tokenId) public { 
        
        require(!checkStarCoordinates(_dec, _mag, _cent), "apparently the coordinates already exists");
        
        require(bytes(_name).length != 0, "no name");

        require(bytes(_story).length != 0, "no story");

        require(_tokenId != 0, " no tokenId");

        StarCoordinates memory coord = StarCoordinates(_dec, _mag, _cent);

        Star memory newStar = Star(_name, coord, _story);


        tokenIdToStarInfo[_tokenId] = newStar;

        mint(msg.sender, _tokenId);
    }
    
    function mint(uint256 tokenId) public {
        super._mint(msg.sender, tokenId);
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

    function checkStarCoordinates(string _dec, string _mag, string _cent) internal returns(bool) {

        require(bytes(_mag).length != 0);

        require(bytes(_dec).length != 0);

        require(bytes(_cent).length != 0);

        bytes32 hash = generateHash(_dec, _mag, _cent);

        if (isStarCoordinates[hash] == true) {return true;}
        
        isStarCoordinates[hash] = true;

        return false;
    }
    
    function generateHash(string _dec, string _mag, string _cent) internal pure returns(bytes32) {
        return keccak256(abi.encodePacked(_mag, _dec, _cent));
    }
}