// SPDX-License-Identifier: MIT

pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/utils/Counters.sol";

contract ContriSBT is ERC721, Ownable {

  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;

  string private _baseUri;

  address controller;

  address contriDeployer;

  uint256 NO_BADGE = 99999999;//If we put this number into the addReward function, we get no badge added

  struct user {

    uint8 status;//0 means not a user, 1 means exsisting user, 2 means balcklisted user

    uint256 userEXP;

    uint256[] userBadge;

  }

  mapping (address => user) userMapping;

  mapping (uint256 => string)badgeMapping;

  constructor(string memory baseUri) ERC721("MetaOasis DAO SBT", "MOSBT") {

    _baseUri = baseUri;

    contriDeployer = msg.sender;

  }

  modifier onlyController(){

    require(msg.sender == controller || msg.sender == contriDeployer || msg.sender == address(this));

    _;

  }

  /**

  * @dev create a user in a DAO

*/

  function createUser(address userAddr)private {

    userMapping[userAddr].userEXP = 0;

    userMapping[userAddr].status = 1;

  }

  /**

  * @dev Create a badge in a DAO

*/

  function createBadge(uint256 badgeID,string memory badgeURI)public onlyController{

    badgeMapping[badgeID] = badgeURI;

  }

  function searchUserInfo(address userAddr)public view returns(user memory){

    return userMapping[userAddr];

  }

  /**

  * @dev add EXP and badge for one user in a DAO

*/

  function addReward(address userAddr, uint16 addEXP, uint256 badgeID)public onlyController{

    require(userMapping[userAddr].status == 1,"This address is not a DAO member or has been blacklisted");

    require(addEXP>=0,"The EXP added must be a positive number");

    require(bytes(badgeMapping[badgeID]).length!=0,"Badge doesn't exist");

    if(badgeID!=0 && badgeID != NO_BADGE)userMapping[userAddr].userBadge.push(badgeID);

    if(addEXP!=0)userMapping[userAddr].userEXP += addEXP;

  }

  function searchForBadge(uint256 badgeID)public view returns(string memory){

    return badgeMapping[badgeID];

  }

  function addController(address DAO)public onlyOwner{

    controller = DAO;

  }

  function blacklistUser(address userAddr)public onlyController{

    userMapping[userAddr].status = 2;

  }

  function safeMint(address to)onlyController public {

    _tokenIdCounter.increment();

    uint256 tokenId = _tokenIdCounter.current();

    require(balanceOf(to) < 1, "You can only mint 1 SBT in 1 DAO");

    createUser(to);

    _safeMint(to, tokenId);

  }

  /**

  * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each

* token will be the concatenation of the `baseURI` and the `tokenId`. Empty

* by default, can be overriden in child contracts.

*/

  function _baseURI() internal view virtual override returns (string memory) {

    return _baseUri;

  }

  function changeUri(string memory baseUri) public onlyOwner {

    _baseUri = baseUri;

  }

  /**

  * @dev search the tokenID of any SBT owner.

*/

  function SBTOf(address owner) view public returns (uint256) {

    for (uint256 i = _tokenIdCounter.current(); i > 0; i--) {

      if (owner == ownerOf(i)) {

        return i;

      }

    }

    return 0;

  }

  //SBT cannot be transferred

  function _transfer(

    address from,

    address to,

    uint256 tokenId

  ) internal override {

    require(false, "SBT: SBT Can't Be Transferred");

  }

}
