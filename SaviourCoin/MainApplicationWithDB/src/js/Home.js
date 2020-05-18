import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import Forum from '../../build/contracts/Forum.json'
import Content from './Content'
import 'bootstrap/dist/css/bootstrap.css'
import equal from 'fast-deep-equal'

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      accounts: [],
      forums: [],
      from: '0x0',
      to: '0x0',
      balanceTo: 0,
      balanceFrom: 0,
      forumName: ''
    }

  this.transferCurrency = this.transferCurrency.bind(this)
  this.updateUser = this.updateUser.bind(this)
  this.setup = this.setup.bind(this)
  this.createForum = this.createForum.bind(this)

  this.Web3 = require('web3')
  this.web3 = new Web3('HTTP://127.0.0.1:7545')

  /*
  this.web3 = new Web3(new Web3.providers.HttpProvider(
  	'HTTP://127.0.0.1:7545',
  	{
  		headers: [{
  			name:'Access-Control-Allow-Origin',
  			value: 'HTTP://127.0.0.1:7545'
  		}]
  	}

  	))
  	*/

  this.contractJson = require('../../build/contracts/Forum.json')
  this.contractAddress = this.contractJson.networks[5777].address //Osäker på om den här är hårdkodad

  this.contract = new this.web3.eth.Contract(this.contractJson.abi, this.contractAddress)
  }

  componentDidMount() {
    this.updateUser();
  }
 
  setup() {
    /*
    this.contract.methods.createForum("Reddit").send({from: this.state.from, gas: 6721975})
    .once('receipt', (receipt) => {console.log('\n' + "Transaction successfull!")});

    this.contract.methods.createForum("Stackoverflow").send({from: this.state.to, gas: 6721975})
    .once('receipt', (receipt) => {console.log('\n' + "Transaction successfull!")});

    this.contract.methods.addUserToForum(this.state.from, "user", 100).send({from: this.state.to, gas: 6721975})
    .once('receipt', (receipt) => {console.log('\n' + "Transaction successfull!")});
    */
    /*
    this.contract.methods.getMyForums().call((err, myForums) => {
      console.log("Error: " + err);
      console.log("Forum: " + myForums[0]);
    });*/

    /*
    this.contract.methods.getMyForums().send({from: this.state.from, gas: 6721975})
    .once('receipt', (receipt) => {console.log('\n' + "Transaction successfull!")});
    */
    
    /*
    this.contract.methods.createForum("Stackoverflow").send({from: this.state.from, gas: 6721975})
    .once('receipt', (receipt) => {console.log('\n' + "Transaction successfull!")});
    */
    
    this.contract.methods.getForumCount().call({gas: 6721975}, (err, id) => {
    	console.log('error: ' + err);
      console.log('ids: ' + id);
      var i;
      for(i = 1; i <= id; i++) {
        this.contract.methods.getMemberStatus(i).call((err, obj) => {
          //console.log(obj.success)
          if(obj.success) {
            //obj._fID
            this.contract.methods.getMyInfoByFid(obj._fID).call((err, result)=> {
              
              console.log(result)

              this.setState(prevState => ({
                forums: [...prevState.forums, result]
              }))
              
            })
          }
        })
      }
    });
    
    console.log(this.state.forums)
  }

  updateUser() {
    this.web3.eth.getAccounts().then((accs) => {
      this.setState({ accounts: accs })

      this.setState({ from: this.state.accounts[0] })
      this.setState({ to: this.state.accounts[1] })
      
      this.contract.methods.balanceOf(this.state.to).call((err, result) => {
        this.setState({ balanceTo: result })
      })
      this.contract.methods.balanceOf(this.state.from).call( (err, result) => {
        this.setState({ balanceFrom: result })
      })
  })
  }

  transferCurrency(to, from, value) {
    this.contract.methods.transfer(to, value).send({from: from})
    .once('receipt', (receipt) => {console.log('\n' + "Transaction successfull!")});

    this.updateUser()
  }

  createForum(event) {
    event.preventDefault()
    console.log("Forum Name: " + this.state.forumName)
    if (this.forumName == '') {
      console.log("You must enter a Forum name")
    } else {
    this.contract.methods.createForum(this.state.forumName).send({from: this.state.from, gas: 6721975})
    .once('receipt', (receipt) => {console.log('\n' + "Transaction successfull!")});
    }
  }

  logChange(e, key) {
    this.setState({[key]: e.target.value});
  }

  render() {
  	return(
      <div>
        <div>

          <ul className="list-group">
            {this.state.forums.map(forum => {
              return <li className="list-group-item" key={forum._fID}>
                <h1>{forum._forumName}</h1> <br></br>
                <p>Karma: {forum._karma}</p> <br></br>
                <p>Checkout Price: {forum._checkOutPrice}</p>
              </li>
            })}
          </ul>

          <a href="#" onClick={() => this.setup()}><button>Setup</button></a>


          <div className="container register-form">
            <form onSubmit={this.createForum}>
                <label>Forum name</label>
                <input type="text" className="form-control" onChange={e => this.logChange(e, "forumName")}/>
                <div className="submit-section">
                    <button className="btn btn-uth-submit">Create</button>
                </div>
            </form>
          </div>

        </div>
      </div>
    )
  }
}

export default Home;