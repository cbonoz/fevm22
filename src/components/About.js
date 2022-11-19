import React from "react"
import ReactMarkdown from "react-markdown"
import { APP_DESC, APP_NAME } from "../constants"

import logo from './../assets/logo_trans.png'

// TODO: replace markdown here

const text = `

${APP_NAME}
---

${APP_NAME} is a blockchain product tracking platform for any dataset.


### Motivation


For those vendors using existing software platforms (such as Flexport), much of the data is only held centrally within those platforms, subject to custom terms and conditions, and modifiable by their internal teams. Also often need to have a formal app B2B subscription plan.

Other common challenges that occur outside of platforms can include limitations from the non-universal nature of email (emails are private between sender and recipient), delays might not be accurately or consistently reported, and products might be lost.

Using FEVM smart contracts, Datamarket can:
1. Enable an immutable, append-only, history of purchases against a DataMarket smartcontract
2. 
3. 


`

export const About = () => {
    return <div>
        <br/>
        <img src={logo} className='about-logo'></img>
        <br/>
        <br/>
        <h1>About</h1>
        <ReactMarkdown>{text}</ReactMarkdown>
        <a href="https://github.com/cbonoz/chainfa22" target="_blank">Github</a>
        <p>

</p>

</div>
}