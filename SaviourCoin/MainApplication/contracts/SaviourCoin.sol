/*
Implements EIP20 token standard: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
.*/


pragma solidity ^0.5.0;

import "./EIP20Interface.sol";


contract SaviourCoin is EIP20Interface {

    uint256 constant private MAX_UINT256 = 2**256 - 1;
    mapping (address => uint256) public balances;
    mapping (address => mapping (address => uint256)) public allowed;
    /*
    NOTE:
    The following variables are OPTIONAL vanities. One does not have to include them.
    They allow one to customise the token contract & in no way influences the core functionality.
    Some wallets/interfaces might not even bother to look at this information.
    */
    string public name;                   //fancy name: eg Simon Bucks
    uint8 public decimals;                //How many decimals to show.
    string public symbol;                 //An identifier: eg SBX
    uint256 public forumID;
    uint256 private forumIndex = 0;
    mapping(address => uint256) public ids;

    mapping(address => mapping (uint256 => userData)) public forums;
    //mapping(uint256 => userData) forumData;

    struct userData {
      address userAddress;
      bytes32 userName;
      uint256 karma;
    }

    constructor (
        uint256 _initialAmount,
        string memory _tokenName,
        uint8 _decimalUnits,
        string memory _tokenSymbol
    ) public {
        balances[msg.sender] = _initialAmount;               // Give the creator all initial tokens
        totalSupply = _initialAmount;                        // Update total supply
        name = _tokenName;                                   // Set the name for display purposes
        decimals = _decimalUnits;                            // Amount of decimals for display purposes
        symbol = _tokenSymbol;                               // Set the symbol for display purposes
        forumID = 0;
    }

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

    function helloWorld() public pure returns (string memory) {
        return "Hello there, I exists!";
    }

    function generateForumID() public returns (uint256 id) {
      forumID++;
      ids[msg.sender] = forumID;
      return forumID;
    }

    function getMyForumID() public view returns (uint256 id) {
      return ids[msg.sender];
    }

    function addUserToForum(address _userAddress, bytes32 _userName, uint256 _karma) public returns (bool success){
      userData storage forumUserData = forums[msg.sender][forumIndex];
      forumUserData.userAddress = _userAddress;
      forumUserData.userName = _userName;
      forumUserData.karma = _karma;
      forumIndex++;
      return true;
    }

    function getCurrentForumIndex() public view returns (uint256){
      return forumIndex;
    }

}
