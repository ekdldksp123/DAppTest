const optionDefinitions = [
    { name: "infuraFileToken", type: String },
    { name: "privateKey", type: String }, // add private argument (private key는 코드안에 직접 집어넣지 않고 따로 파일을 만들어서 fs모듈로 불러왔습니다.)
  ]
  
const commandLineArgs = require("command-line-args")
const options = commandLineArgs(optionDefinitions)

const Web3 = require("web3")
const fs = require("fs")
const Tx = require("ethereumjs-tx") // ethereumjs-tx version 1.3.7 사용. (최신 버전을 사용할 경우에는 constructor 관련 에러와 invalid sender 에러가 떠서 버전 수정하였습니다.)
const infura_token = fs.readFileSync(options.infuraFileToken, "utf8")
const private_key = fs.readFileSync(options.privateKey, "utf8")
const node_host = `https://ropsten.infura.io/v3/${infura_token}`