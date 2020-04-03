/*
Implements EIP20 token standard: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
.*/


pragma solidity ^0.5.0;


contract Forum {

  mapping (address => mapping (address => userData)) private forumUsers;

    struct userData{
      address userAddress;
      string userName;
      uint256 karma;
    }

    constructor () public {
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
