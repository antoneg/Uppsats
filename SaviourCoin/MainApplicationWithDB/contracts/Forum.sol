/*
Implements EIP20 token standard: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
.*/


pragma solidity ^0.5.0;

import "./EIP20Interface.sol";


contract Forum is EIP20Interface {
    // The coin
    uint256 constant private MAX_UINT256 = 2**256 - 1;
    mapping (address => uint256) public balances;
    mapping (address => mapping (address => uint256)) public allowed;

    string public name;
    uint8 public decimals;
    string public symbol;

    // Forum
    mapping (address => forumData) private forums;    // An address can hold a forum
    mapping (uint => address) private fidOwner;       // A forumID (fid) is mapped to an owner of a forum with this fid.
    uint256 private forumId;                          // Increments when a new forum is created
    mapping (address => uint256) addressForumId;

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

    constructor (
        uint256 _initialAmount,
        string memory _tokenName,
        uint8 _decimalUnits,
        string memory _tokenSymbol
    ) public {
        balances[msg.sender] = _initialAmount;
        totalSupply = _initialAmount;
        name = _tokenName;
        decimals = _decimalUnits;
        symbol = _tokenSymbol;
        forumId = 1;
    }

    // Coin functions...
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balances[msg.sender] >= _value);
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        uint256 allowance = allowed[_from][msg.sender];
        require(balances[_from] >= _value && allowance >= _value);
        balances[_to] += _value;
        balances[_from] -= _value;
        if (allowance < MAX_UINT256) {
            allowed[_from][msg.sender] -= _value;
        }
        emit Transfer(_from, _to, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }
    // .. end of coin functions






    // Forum functions...

    function createForum(string memory _fname) public returns (bool success){
      uint256 a = forums[msg.sender].fid;
      uint256 b = addressForumId[msg.sender];
      if((a != 0) && (a == b)){
        revert("You already own a forum.");
      }
      forums[msg.sender] = forumData(msg.sender, _fname, forumId, 0);
      forums[msg.sender].users[0] = userData(msg.sender, _fname, 0);
      forums[msg.sender].userExists[msg.sender] = true;
      forums[msg.sender].userKey[msg.sender] = 0;
      forums[msg.sender].userCount ++;
      addressForumId[msg.sender] = forumId;
      fidOwner[forumId] = msg.sender;
      forumId = forumId + 1;
      emit CreateForum(true, msg.sender, _fname, forums[msg.sender].fid);
      return (true);
    }

    function getForumCount() public view returns (uint256 id){
      return (forumId-1);
    }

    function getForumDataByFid(uint256 _fid) public view returns (address forumOwner, string memory forumName, uint256 fid){
      address owner = fidOwner[_fid];
      if(owner == address(0x0))
        revert("Forum does not exists.");
      string memory fName = forums[owner].forumName;
      uint256 id = forums[owner].fid;
      return(owner, fName, id);
    }

    function getForumData(address _owner) public view returns (address forumOwner, string memory forumName, uint256 fid){
      if(addressForumId[msg.sender] == 0){
        revert("Forum does not exists.");
      }
      string memory fName = forums[_owner].forumName;
      uint256 id = forums[_owner].fid;
      return(_owner, fName, id);
    }

    function addUserToForum(address _userAddress, string memory _userName, uint256 _karma) public returns (bool success){
      if(forums[msg.sender].owner != msg.sender){
        revert("You need to create a forum first.");
      }
      if(forums[msg.sender].userExists[_userAddress] == true){
        revert("User already exists.");
      }
        forums[msg.sender].userCount++;
        uint256 newUserCount = forums[msg.sender].userCount;
        forums[msg.sender].users[newUserCount] = userData(_userAddress, _userName, _karma);
        forums[msg.sender].userExists[_userAddress] = true;
        forums[msg.sender].userKey[_userAddress] = newUserCount;
        emit AddUserToForum(_userAddress, _userName, _karma);
        return (true);
    }

    function setKarma(uint256 _karma, address _userAddress) public returns (bool succ){
      if(forums[msg.sender].owner == address(0x0)){
        return false;
      }
      if(!forums[msg.sender].userExists[_userAddress]){
        return false;
      }
      uint256 ukey = forums[msg.sender].userKey[_userAddress];
      forums[msg.sender].users[ukey].karma = _karma;
      return true;
    }

    function getUserByAddress(address _userAddress) public view returns (address usrAddress, string memory usrName, uint256 usrKarma) {
        if(forums[msg.sender].owner == address(0x0)){
          revert("You need to create a forum first.");
        }
        if(!forums[msg.sender].userExists[_userAddress]){
          revert("This user does not exists.");
        }
        uint256 uKey = forums[msg.sender].userKey[_userAddress];
        address uaddress = forums[msg.sender].users[uKey].userAddress;
        string memory uname = forums[msg.sender].users[uKey].userName;
        uint256 ukarma = forums[msg.sender].users[uKey].karma;
        return (uaddress, uname, ukarma);
    }

    function getUserByIndex(uint256 _ucount) public view returns (address usrAddress, string memory usrName, uint256 usrKarma){
      if(forums[msg.sender].owner == address(0x0)){
        revert("You need to create a forum first");
      }

      if(forums[msg.sender].users[_ucount].userAddress == address(0x0)){
        revert("This user does not exists.");
      }
      address uaddress = forums[msg.sender].users[_ucount].userAddress;
      string memory uname = forums[msg.sender].users[_ucount].userName;
      uint256 ukarma = forums[msg.sender].users[_ucount].karma;
      return (uaddress, uname, ukarma);
      }

    function getUserCount() public view returns (uint256 _ucount){
      return forums[msg.sender].userCount;
    }

    function getMyInfo(address _admin) public view returns (uint256 _fID, address _forumAddress, address _myAddress, string memory _userName, uint256 _karma) {
      bool exists = forums[_admin].userExists[msg.sender];
      if(!exists)
        revert("You are not a member in this forum.");
      uint256 key = forums[_admin].userKey[msg.sender];
      string memory uname = forums[_admin].users[key].userName;
      uint256 karma = forums[_admin].users[key].karma;
      uint256 fid = forums[_admin].fid;
      return (fid, _admin, msg.sender, uname, karma);
    }

    function getMyInfoByFid(uint256 _fid) public view returns (uint256 _fID, address _forumAddress, address _myAddress, string memory _userName, uint256 _karma, uint256 _cashOutPrice, string memory _forumName) {
      address admin = fidOwner[_fid];
      bool exists = forums[admin].userExists[msg.sender];
      if(!exists)
        revert("You are not a member in this forum.");
      uint256 key = forums[admin].userKey[msg.sender];
      string memory uname = forums[admin].users[key].userName;
      uint256 karma = forums[admin].users[key].karma;
      uint256 fid = forums[admin].fid;
      uint256 cashOutPrice = getCashOutPrice(admin);
      string memory fname = forums[admin].forumName;
      return (fid, admin, msg.sender, uname, karma, cashOutPrice, fname);
    }

    function getMemberStatus(uint256 _fid) public view returns (uint256 _fID, bool success){
      address admin = fidOwner[_fid];
      return (_fid, forums[admin].userExists[msg.sender]);
    }

    function accForumKarma(address _forum) public view returns (uint256) {
      uint256 numUsers = forums[_forum].userCount +1;
      uint256 accKarma = 0;
      for(uint256 i = 0; i<numUsers; i++){
        accKarma += forums[_forum].users[i].karma;
      }
      return accKarma;
    }

    function getCashOutPrice(address _forum) public view returns (uint256 _res){
      uint256 totKarma = accForumKarma(_forum);
      uint256 bal = balanceOf(_forum);
      if(totKarma == 0 || bal == 0) return 0;
      uint256 rest = bal % totKarma;
      uint256 res = (bal-rest)/totKarma;
      return res;
    }

    function cashOut(address _forum) public returns (bool _succ){
      if (forums[_forum].fid == 0)
        revert("Forum does not exist");
      uint256 val = getCashOutPrice(_forum);
      if (val == 0)
        revert("Cash-out price is 0 scones.");
      if(!forums[_forum].userExists[msg.sender])
        revert("You are not a member in this forum");
      uint256 myKey = forums[_forum].userKey[msg.sender];
      uint256 myKarma = forums[_forum].users[myKey].karma;
      if(myKarma == 0)
        revert("You need karma to cash out.");

      balances[_forum] -= myKarma*val;
      balances[msg.sender] += myKarma*val;
      forums[_forum].users[myKey].karma = 0;
      emit CashOut(val,myKarma, _forum, msg.sender);
      return true;
    }

    event CashOut(uint256 _cop, uint256 _karma, address _from, address _to);
    event AddUserToForum(address _userAddress, string _userName, uint256 _karma);
    event CreateForum(bool _success, address _forumAddress, string _forumName, uint256 _fid);
}
