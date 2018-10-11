<template>
  <div class="hello">
    <h1>Welcome to ontology</h1>
    <h2>check to see the total supply</h2>
    <ul class="btns">
      <li class="btn-item clearfix">
        <div class="lottery-btn" @click="querySupply">
          <p>totalSupply: {{total_supply}} keys</p>
        </div>
      </li>
      <li class="btn-item clearfix">
        <div class="lottery-btn" @click="queryFakeSupply">
          <p>fakeTotalSupply: {{fake_total_supply}} fake keys</p>
        </div>
      </li>
      <li class="btn-item clearfix">
        <div class="lottery-btn" @click="queryTotalOngBalance">
          <p>totalOngBalance: {{total_ong_balance}} ONG </p>
        </div>
      </li>
      <li class="btn-item clearfix">
        <div class="lottery-btn" @click="queryTotalOngForKey">
          <p>totalOngForKey: {{total_ong_for_key}} ONG for key </p>
        </div>
      </li>
      <li class="btn-item clearfix">
        <div class="lottery-btn" @click="queryName">
          <p>Name of the game: {{name}} </p>
        </div>
      </li>
      <li class="btn-item clearfix">
        <div class="lottery-btn" @click="queryBalanceOf">
          <p>balanceOf this account is : {{balance_of}} keys </p>
        </div>
      </li>
      <li class="btn-item clearfix">
        <div class="lottery-btn" @click="buy">
          <p>try to buy with 1 ONG </p>
        </div>
        <div class="round-content">
          <p>Count Round Num: 88888888</p>
          <p>Winner Of Last Round: 999999999</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {client} from 'ontology-dapi'
import {Parameter, ParameterType, utils, Crypto} from 'ontology-ts-sdk'

const contract = '086b8a1dcd095ec44e98afed1764a9a5f0204146'
// const gasLimit = 30000
// const gasPrice = 500

export default {
  name: 'HelloWorld',
  data () {
    return {
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
      ong_balance_of: null,
      referral_balance_of: null,
      dividend_of: null,
      direct_referral_of: null
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
        console.log('totalSupply is --- ' + this.total_supply + ' key ')
      }
      if (this.fake_total_supply >= 0) {
        console.log('fakeTotalSupply is --- ' + this.fake_total_supply + ' fake key')
      }
      if (this.total_ong_balance >= 0) {
        console.log('totalOngBalance is --- ' + this.total_ong_balance + ' ONG ')
      }
      if (this.total_ong_for_key >= 0) {
        console.log('totalOngForKey is --- ' + this.total_ong_for_key + ' ONG for key')
      }


      const name1 = await this.queryName()
      this.name = utils.hexstr2str(name1)

      const balanceOf1 = await this.queryBalanceOf()
      this.balance_of = balanceOf1 || 0
      this.balance_of = parseInt(utils.reverseHex(this.balance_of), 16) / 10 ** 9


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
        console.log(account)
      } catch (err) {
        console.log(err)
        this.$message.warning('No account found in the provider. Please prepare an account before joining the game.')
        return 'NO_ACCOUNT'
      }
      const acct = new Crypto.Address(account).serialize()
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
        console.log('onScCall finished, result:' + JSON.stringify(result))
        return result
      } catch (e) {
        console.log('onScCall error:', e)
        this.$message.error('Some error happens. Please try later.')
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
