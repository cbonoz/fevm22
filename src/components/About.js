import React from "react"
import ReactMarkdown from "react-markdown"
import { APP_DESC, APP_NAME } from "../constants"

import logo from './../assets/logo_trans.png'

// TODO: replace markdown here

const text = `

${APP_NAME}
---

### Motivation

Decentralized exchanges, also known as DEXs, are peer-to-peer marketplaces where cryptocurrency traders make transactions directly without handing over management of their funds to an intermediary or custodian.

Existing data exchange platforms exist, like https://www.narrative.io/pricing, however either require long term commitments or having transactions mediated through a third party with high fees and staff overhead.

### How it works

Users create data pages which are purchase pages for secured IPFS datasets.

DataMarket is self-governing. If a bad or inaccurate dataset is uploaded and sold, a purchaser or potential purchaser can flag the dataset as being fraudulent. The dataset page is locked after three flags.

To ensure that the data provides user satisfaction, the user is only paid out from the contract after three non-flagged successful sales, and each sale after that. This is done automatically via logic tied to the purchaseData contract method 

Each dataset cannot be modified after it is posted, but the price can be updated by the owner and it can be marked as inactive. A new page should be created if a dataset needs to be changed - this protects the mutability and trust of existing pages.


Using FEVM smart contracts, Datamarket can:
1. Enable an immutable, append-only, history of interactions against DataMarket smartcontracts.
2. Store the data in a scalable/low-cost way for data owners, where no single source has to be the custodian of the data log.
3. Perform low cost, high volume, and fast transactions on the FEVM network.
4. Be self-governing by the user base and flag or shutdown any fraudulent pages by logic included in the FEVM smart contract.

`

export const About = () => {
    return <div>
        <br/>
        <img src={logo} className='about-logo'></img>
        <br/>
        <br/>
        <h1>About</h1>
        <ReactMarkdown>{text}</ReactMarkdown>
        <a href="https://github.com/cbonoz/fevm22" target="_blank">Github</a>
        <p>

</p>

</div>
}