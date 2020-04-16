//Klientsidan
  //CHECK! Kunna se alla forum från klientsida.
  //Se till att inte kunna bli tillagd i ett forum hur som helst.
  //Mina uppgifter i ett forum.
 // Skicka säga "ok" att få bli tillagd i ett forum.
//Forumskaparsida
  // Kolla om användaren har godkänt att bli tillagd.
  // Get userCount
  // GetUser by usercount

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

    function createForum(string memory _fname) public returns (bool success){
      uint256 a = forums[msg.sender].fid;
      uint256 b = addressForumId[msg.sender];
      if((a != 0) && (a == b)){
        emit CreateForum(false, "You already own a forum! ", msg.sender, _fname, forumId);
        return(false);
      }
      forums[msg.sender] = forumData(msg.sender, _fname, forumId, 0);
      forums[msg.sender].users[0] = userData(msg.sender, _fname, 0);
      forums[msg.sender].userExists[msg.sender] = true;
      forums[msg.sender].userKey[msg.sender] = 0;
      forums[msg.sender].userCount ++;
      addressForumId[msg.sender] = forumId;
      fidOwner[forumId] = msg.sender;
      forumId = forumId + 1;
      emit CreateForum(true, "Forum created successfully! ", msg.sender, _fname, forumId);
      return (true);
    }

    function getForumCount() public view returns (uint256 id){
      return forumId;
    }

    function getForumData(uint256 _fid) public view returns (bool succ, address Owner, string memory Forum_Name, uint256 Forum_ID){
      address owner = fidOwner[_fid];
      if(owner == address(0x0))
        return (false, owner, "Forum does not exist. ", 0);
      string memory fName = forums[owner].forumName;
      uint256 id = forums[owner].fid;
      return(true, owner, fName, id);
    }

    function getForumData(address _owner) public view returns (bool succ, address Owner, string memory Forum_Name, uint256 Forum_ID){
      if(addressForumId[msg.sender] == 0){
        return (false, address(0x0), "Forum does not exists. ", 0);
      }
      string memory fName = forums[_owner].forumName;
      uint256 id = forums[_owner].fid;
      return(true, _owner, fName, id);
    }

    function addUserToForum(address _userAddress, string memory _userName, uint256 _karma) public returns (bool success){
      if(forums[msg.sender].owner != msg.sender){
        emit AddUserToForum(false, "You need to create a forum first. ", _userAddress, _userName);
        return (false);
      }
      if(forums[msg.sender].userExists[_userAddress] == true){
        emit AddUserToForum(false, "User already exists. ", _userAddress,  _userName);
        return (false);
      }
      if(!forums[msg.sender].userExists[_userAddress]){
        forums[msg.sender].userCount++;
        uint256 newUserCount = forums[msg.sender].userCount;
        forums[msg.sender].users[newUserCount] = userData(_userAddress, _userName, _karma);
        forums[msg.sender].userExists[_userAddress] = true;
        forums[msg.sender].userKey[_userAddress] = newUserCount;
        emit AddUserToForum(true, "Member added successfully. ", _userAddress, _userName);
        return (true);

      }
      emit AddUserToForum(false, "Something went wrong. This error is weird, do you suck? ", _userAddress, _userName);
      return (false);
    }


    function getUserData(address _userAddress) public view returns (bool succ, address _address, string memory _userinfo, uint256 _karma) {
        if(forums[msg.sender].owner == address(0x0)){
          return (false, address(0x0), "You need to create a forum first", 0);
        }
        if(forums[msg.sender].userExists[_userAddress]){
          uint256 uKey = forums[msg.sender].userKey[_userAddress];
          address uaddress = forums[msg.sender].users[uKey].userAddress;
          string memory uname = forums[msg.sender].users[uKey].userName;
          uint256 karm = forums[msg.sender].users[uKey].karma;
          return (true, uaddress, uname, karm);
        }
        if(!forums[msg.sender].userExists[_userAddress]){
          return(false, address(0x0), "This user does not exists in your forum", 0);
        }
        return(false, address(0x0),"Something went wrong with adding a new member.", 0);
    }
    event Succ(bool success);
    event AddUserToForum(bool succ, string info, address _userAddress, string _userName);
    event CreateForum(bool succ, string info, address self, string fname, uint256 fid);
}
