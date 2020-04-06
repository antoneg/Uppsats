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
  address[] private testz;

  struct forumData{
    address owner;
    string forumName;
    uint256 fid;
  }

    struct userData{
      address userAddress;
      string userName;
      uint256 karma;
    }

    constructor () public {
      forumId = 0;
    }

    function createForum(string memory _fname) public returns (uint256 forum_created){
      forums[msg.sender] = forumData(msg.sender, _fname, forumId);
      uint256 x = getForumId();
      fidOwner[x] = msg.sender;
      testz.push(msg.sender);
      forumId = forumId + 1;
      return forumId;
    }

    function getForumId() public returns (uint256 id){
      return forumId;
    }

    function getForumData(uint256 _fid) public view returns (address Owner, string memory Forum_Name, uint256 Forum_ID){
      address owner = fidOwner[_fid];
      string memory fName = forums[owner].forumName;
      uint256 id = forums[owner].fid;
      return(owner, fName, id);
    }

    function addUserToForum(address _userAddress, string memory _userName, uint256 _karma) public returns (bool success){
      userData memory newMember = userData(_userAddress, _userName, _karma);
      if(forumUsers[msg.sender][_userAddress].userAddress == address(0x0)){
        forumUsers[msg.sender][_userAddress] = newMember;
        emit AddUserToForum(true, _userAddress, _userName, _karma);
        return true;
      }
      emit AddUserToForum(false, _userAddress, _userName, _karma);
      return false;
    }

    function getUserData(address _userAddress) public view returns (address _address, string memory _userinfo, uint256 _karma) {
        address uaddress = forumUsers[msg.sender][_userAddress].userAddress;
        string memory uname = forumUsers[msg.sender][_userAddress].userName;
        uint256 karm = forumUsers[msg.sender][_userAddress].karma;

        return (uaddress, uname, karm);
    }


    event AddUserToForum(bool _success, address _userAddress, string _userName, uint256 _karma);

}
