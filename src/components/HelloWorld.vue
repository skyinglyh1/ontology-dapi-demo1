<template>
  <div class="hello">
    <h1>Welcome to ontology</h1>
    <h2>check to see the total supply</h2>
    <ul class="btns">
      <li class="btn-item clearfix">
        <div class="lottery-btn" @click="querySupply">
          <p>totalSupply: {{total_supply}}</p>
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
      total_supply: null
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
      this.total_supply = supply1 || 0
      this.total_supply = parseInt(this.total_supply, 16)
      if (this.total_supply >= 0) {
        console.log('totalSupply' + this.total_supply)
      }
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
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #fcf158;
}

.btns {
  width:500px;
  margin:20px auto;
}
.btn-item {
  display: block;
  margin-bottom:20px;
  border:1px solid #dddddd;
  padding:10px;
}
.lottery-btn {
  width:1500px;
  height:100px;
  line-height: 50px;
  text-align: center;
  background: #f7ce1b;
  font-size:20px;
  font-weight: bold;
  color: #ffffff;
  cursor: pointer;
  float: left;
}
.lottery-btn :hover {
  background: #b39305
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
