<template>
  <div class="hello">
    <h1>Welcome to ontology</h1>
    <h2>check to see the total supply</h2>
    <ul class="btns">
      <li class="btn-item clearfix">
          <p>totalSupply: {{total_supply}} keys</p>
      </li>
      <li class="btn-item clearfix">
          <p>fakeTotalSupply: {{fake_total_supply}} fake keys</p>
      </li>
      <li class="btn-item clearfix">
          <p>totalOngBalance: {{total_ong_balance}} ONG </p>
      </li>
      <li class="btn-item clearfix">
          <p>totalOngForKey: {{total_ong_for_key}} ONG for key </p>
      </li>
      <li class="btn-item clearfix">
          <p>Name of the game: {{name}} </p>
      </li>
      <li class="btn-item clearfix">
          <p>balanceOf this account is : {{balance_of}} keys </p>
      </li>
      <li class="btn-item clearfix">
        <div class="lottery-btn" @click="buy(1000000000, 0)">
          <p>try to buy with 1 ONG </p>
        </div>
        <div class="round-content">
          <p>bought keys amount from return of buy: {{bought_key_amount}}</p>
          <p>Winner Of Last Round: 999999999</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {client} from 'ontology-dapi'
import {Parameter, ParameterType, utils, Crypto} from 'ontology-ts-sdk'
// import { ParameterTypeVal } from 'ontology-ts-sdk/lib/types/smartcontract/abi/parameter'

const contract = '086b8a1dcd095ec44e98afed1764a9a5f0204146'
const gasLimit = 100000
const gasPrice = 500

export default {
  name: 'HelloWorld',
  data () {
    return {
      utils: utils,
      total_supply: null,
      fake_total_supply: null,
      total_ong_balance: null,
      total_ong_for_key: null,
      name: null,
      symbol: null,
      decimals: null,
      stake_requirement: null,
      price: null,
      balance_of: null,
      bought_key_amount: null
    }
  },
  async mounted () {
    try { // get provider
      const provider = await client.api.provider.getProvider()
      console.log('onGetProvider: ' + JSON.stringify(provider))
      this.provider = provider
    } catch (e) {
      console.log('No dAPI provider istalled.')
      this.$message.warning('No provider installed. Please install the Cyano Wallet before joining the game.')
      return null
    }
    this.intervalId = setInterval(() => {
      this.refresh()
    }, 3000)
  },
  beforeDestroy () {
    clearInterval(this.intervalId)
  },
  methods: {
    buy(ongAmount, directReferral) {
      if(!this.provider) {
        return
      }
      this.$confirm({
        title: `This game needs you input ongAmount and your referral`,
        content: `You can buy maximum 5 ong worth of keys for players`,
        okText: `join`,
        okType: 'Primary',
        cancelText: 'Not now',
        onOk: () => {
          console.log('ongAmount is -- ' + ongAmount + ', directferral is -- ' + directReferral)
          this.handleBuy(ongAmount, directReferral)
        },
      })
    },
    async handleBuy(ongAmount, directferral) {
      let account
      // get account
      try{
        account = await client.api.asset.getAccount()
        // console.log('fromAccount is -- ' + account)
      }catch (err) {
        console.log(err)
        this.$message.warning('No account found in the provider. Please try again later.')
        return 'No_ACCOUNT'
      }
      
      const acct = new Crypto.Address(account).serialize()
      if (directferral) {
        const directferralByteArray = new Crypto.Address(directferral).serialize()
      }
        
        
      // invoke
      const method = 'buy'
      const parameters = [
        new Parameter('account', ParameterType.ByteArray, acct),
        new Parameter('ongAmount', ParameterType.Integer, ongAmount),
        new Parameter('directReferral', ParameterType.Integer, 0)
      ]
      const params = {
        contract,
        method,
        parameters,
        gasPrice,
        gasLimit
      }
      const result = await this.scInvoke(params, false)
      if (result) {
        this.$message.success('You just bought ' + ongAmount + ' ONG worth of tokens')
      } else {
        this.$message.error('some error happens in your buy, please try again later')
      }
      let res = JSON.stringify(result)
      console.log('res --- ' + res)
      let result1 = JSON.parse(res)
      let result2 = result1.result
      let txhash = result1.transaction
      let event1 = result2[result2.length - 1]
      console.log('result --- ' + event1)
      console.log('event --- ' + utils.hexstr2str(event1[0]))
      console.log('address ---(base58) ' + new Crypto.Address(event1[1]).toBase58())
      console.log('ongAmount --- ' + parseInt(utils.reverseHex(event1[2]), 16) / 10 ** 9)
      console.log('tokenAmount --- ' + parseInt(utils.reverseHex(event1[3]), 16) / 10 ** 9)
      const event14 = event1[4]
      if (event14 == '00') {
        console.log('null ************')
      }
      else {
        console.log('referredBy ---(base58) ' + new Crypto.Address(event14).toBase58())
        console.log('something************')
      }
      
      
      console.log('txhash --- ' + txhash)
      this.bought_key_amount = parseInt(utils.reverseHex(event1[3]), 16) / 10 ** 9
      return this.bought_key_amount

    },

    async refresh () {
      const supply1 = await this.querySupply()
      const fakeSupply1 = await this.queryFakeSupply()
      const totalOngBalance1 = await this.queryTotalOngBalance()
      const totalOngForKey1 = await this.queryTotalOngForKey()
      this.total_supply = supply1 || 0
      this.fake_total_supply = fakeSupply1 || 0
      this.total_ong_balance = totalOngBalance1 || 0
      this.total_ong_for_key = totalOngForKey1 || 0
      this.total_supply = parseInt(utils.reverseHex(this.total_supply), 16) / 10 ** 9
      this.fake_total_supply = parseInt(utils.reverseHex(this.fake_total_supply), 16) / 10 ** 9
      this.total_ong_balance = parseInt(utils.reverseHex(this.total_ong_balance), 16) / 10 ** 9
      this.total_ong_for_key = parseInt(utils.reverseHex(this.total_ong_for_key), 16) / 10 ** 9
      if (this.total_supply >= 0) {
        // console.log('totalSupply is --- ' + this.total_supply + ' key ')
      }
      if (this.fake_total_supply >= 0) {
        // console.log('fakeTotalSupply is --- ' + this.fake_total_supply + ' fake key')
      }
      if (this.total_ong_balance >= 0) {
        // console.log('totalOngBalance is --- ' + this.total_ong_balance + ' ONG ')
      }
      if (this.total_ong_for_key >= 0) {
        // console.log('totalOngForKey is --- ' + this.total_ong_for_key + ' ONG for key')
      }

      const name1 = await this.queryName()
      this.name = utils.hexstr2str(name1)

      const balanceOf1 = await this.queryBalanceOf()
      this.balance_of = balanceOf1 || 0
      this.balance_of = parseInt(utils.reverseHex(this.balance_of), 16) / 10 ** 9

      if (this.name) {
        // console.log('Name is -- ' + this.name)
      }
      if (this.balance_of >= 0) {
        // console.log('balanceOf is --- ' + this.balance_of + ' keys')
      }
      // console.log('bought key amount is -- ' + this.bought_key_amount + 'keys')
  

    },
    async querySupply () {
      const method = 'totalSupply'
      const parameters = []
      const params = {
        contract,
        method,
        parameters
      }
      const supply = await this.scInvoke(params, true)
      return supply
    },
    async queryFakeSupply () {
      const method = 'fakeTotalSupply'
      const parameters = []
      const params = {
        contract,
        method,
        parameters
      }
      const fakeSupply = await this.scInvoke(params, true)
      return fakeSupply
    },
    async queryTotalOngBalance () {
      const method = 'totalOngBalance'
      const parameters = []
      const params = {
        contract,
        method,
        parameters
      }
      const totalOngBalance = await this.scInvoke(params, true)
      return totalOngBalance
    },
    async queryTotalOngForKey () {
      const method = 'totalOngForKey'
      const parameters = []
      const params = {
        contract,
        method,
        parameters
      }
      const totalOngForKey = await this.scInvoke(params, true)
      return totalOngForKey
    },
    async queryName () {
      const method = 'getName'
      const parameters = []
      const params = {
        contract,
        method,
        parameters
      }
      const getName = await this.scInvoke(params, true)
      return getName
    },
    async queryBalanceOf () {
      let account
      try { // get account
        account = await client.api.asset.getAccount()
        // console.log(account)
      } catch (err) {
        console.log(err)
        this.$message.warning('No account found in the provider. Please prepare an account before joining the game.')
        return 'NO_ACCOUNT'
      }
      const acct = new Crypto.Address(account).serialize()
      // console.log('account in queryBalanceOf --- ' + acct)
      // let some = "00"
      // if (some == "00") {
      //   let acctBase58 = new Crypto.Address(some).toBase58()
      //   console.log('account in queryBalanceOf (base58)--- ' + acctBase58)
      //   console.log('yes account')
      // } else {
      //   console.log('no account')
      // }
      

      const method = 'balanceOf'
      const parameters = [
        new Parameter('acct', ParameterType.ByteArray, acct)
      ]
      const params = {
        contract,
        method,
        parameters
      }
      const balanceOf = await this.scInvoke(params, true)
      return balanceOf
    },





    async scInvoke (params, preExec) {
      try {
        let result
        if (preExec) {
          result = await client.api.smartContract.invokeRead(params)
        } else {
          result = await client.api.smartContract.invoke(params)
        }
        // console.log('onScCall finished, result:' + JSON.stringify(result))
        return result
      } catch (e) {
        console.log('onScCall error:', e)
        // this.$message.error('Some error happens. Please try later.')
        return null
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal
}
ul {
  list-style-type: none;
  padding: 0
}
li {
  display: b;
  margin: 0 0;
}
a {
  color: #fcf158;
}

.btns {
  width:95%;
  margin:10px auto;
}
.btn-item {
  display: block;
  margin-bottom:20px;
  border:1px solid #e71414;
}
.lottery-btn {
  width: 50%;
  height: 20%;
  line-height: 50px;
  text-align: center;
  background: #000000;
  font-size:20px;
  font-weight: bold;
  color: #ffffff;
  cursor: pointer;
  float: left;
}
.lottery-btn :hover {
  background: #2eb305
}
.round-content {
  float: left;
  margin-left: 15px;
  text-align: left;
}
.round-content p {
  margin-bottom:5px;
}
</style>
