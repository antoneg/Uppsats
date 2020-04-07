//Klientsidan
  //Kunna se alla forum från klientsida.
  //Se till att inte kunna bli tillagd i ett forum hur som helst.
  //Mina uppgifter i ett forum.

//Forumskaparsida
  //Skapa ett forum
  //Lägga till användare i mitt forum.

//pragma solidity ^0.5.0;
pragma solidity ^0.5.16;


contract Forum {

  mapping (address => mapping (address => userData)) private forumUsers;
  mapping (address => forumData) private forums;
  mapping (uint => address) private fidOwner;
  uint256 private forumId;
  mapping (address => uint256) addressForumId;
//  address[] private testz;

  struct forumData{
    address owner;
    string forumName;
    uint256 fid;
    uint256 userCount;
    mapping(uint256 => userData) users;
    mapping(address => uint256) userKey; //Equal to next userCount.
    mapping(address => bool) userExists;
  }

    struct userData{
      address userAddress;
      string userName;
      uint256 karma;
    }

    constructor () public {
      forumId = 1;
    }

    function createForum(string memory _fname) public returns (uint256 forum_created){
      forums[msg.sender] = forumData(msg.sender, _fname, forumId, 0);
      forums[msg.sender].users[1] = userData(msg.sender, _fname, 0);
      forums[msg.sender].userExists[msg.sender] = true;
      forums[msg.sender].userKey[msg.sender] = 0;
      forums[msg.sender].userCount ++;
      fidOwner[forumId] = msg.sender;
      forumId = forumId + 1;

      return forumId;
    }

    function getForumId() public view returns (uint256 id){
      return forumId;
    }

    function getForumData(uint256 _fid) public view returns (address Owner, string memory Forum_Name, uint256 Forum_ID){
      address owner = fidOwner[_fid];
      string memory fName = forums[owner].forumName;
      uint256 id = forums[owner].fid;
      return(owner, fName, id);
    }

    function addUserToForum(address _userAddress, string memory _userName, uint256 _karma) public returns (bool success){
      if(forums[msg.sender].owner != msg.sender){
        return (msg.sender), "You need to create a forum first", 0);
      }
      if(!forums[msg.sender].userExists[_userAddress]){
        forums[msg.sender].userCount++;
        uint256 newUserCount = forums[msg.sender].userCount;
        forums[msg.sender].users[newUserCount] = userData(_userAddress, _userName, 0);
        forums[msg.sender].userExists[_userAddress] = true;
        forums[msg.sender].userKey[_userAddress] = newUserCount;
        emit AddUserToForum(true, _userAddress, _userName, _karma);
        return true;
      }

      emit AddUserToForum(false, _userAddress, _userName, _karma);
      return false;
    }

    function getUserData(address _userAddress) public view returns (address _address, string memory _userinfo, uint256 _karma) {
        if(forums[msg.sender].owner = address(0x0)){
          return (address(0x0), "You need to create a forum first", 0);
        }
        if(forums[msg.sender].userExists[_userAddress]){
          uint256 uKey = forums[msg.sender].userKey[_userAddress];
          address uaddress = forums[msg.sender].users[uKey].userAddress;
          string memory uname = forums[msg.sender].users[uKey].userName;
          uint256 karm = forums[msg.sender].users[uKey].karma;
          return (uaddress, uname, karm);
        }
        return(address(0x0), "This user does not exists in your forum", 0);

    }


    event AddUserToForum(bool _success, address _userAddress, string _userName, uint256 _karma);

}
