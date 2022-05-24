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

const web3 = new Web3(node_host)

const send_account = "0x483e736C3aC8c11B2F9aCC148f340202c938B6A5"
const receive_account = "0x72f3f648D30A56dC67FC55B85d14846b7Fe39fA7" //?? 어디로 보내라는 거지..

const privateKeyBuffer = Buffer.from(private_key, "hex")

web3.eth.getTransactionCount(send_account, (err, txCount) => { //step 1
    const txObject = {
        nonce: web3.utils.toHex(txCount),
        gasLimit: web3.utils.toHex(1000000),
        gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")),
        to: receive_account,
        value: "0x2C68AF0BB140000", // 0.2 hexcode 변경 
    }

    const tx = new Tx(txObject)
    tx.sign(privateKeyBuffer)

    const serializedTx = tx.serialize()
    const raw = `0x${serializedTx.toString("hex")}`

    web3.eth
        .sendSignedTransaction(raw) //step 2
        .once("transactionHash", hash => {
        console.info("transactionHash", "https://ropsten.etherscan.io/tx/" + hash) // tx가 pending되는 즉시 etherscan에서 tx진행상태를 보여주는 링크를 제공해줍니다.
        })
        .once("receipt", receipt => {
        console.info("receipt", receipt) // 터미널에 receipt 출력
        })
        .on("error", console.error)
})