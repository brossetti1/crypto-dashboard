import React from 'react';
import './style.css';

import fetch from 'isomorphic-fetch';

class CryptoCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.name,
      symbol: props.symbol,
      price: null,
      eth: null,
      lastPrice: null,
      lastEth: null
    }

    this.pollPrice = this.pollPrice.bind(this);
  }

  componentDidMount() {
    this.pollPrice()
    setInterval(this.pollPrice, 10000)
  }

  pollPrice() {
    console.log('polling for price')
    const { symbol } = this.state
    fetch(`https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=${symbol},USD,ETH`)
      .then(resp => resp.json())
      .then(json => {
        console.log(json)
        this.setState((prevState) => (
          {
            price: json.USD,
            eth: json.ETH,
            lastPrice: prevState.price !== json.USD ? prevState.price : prevState.lastPrice,
            lastEth: prevState.eth !== json.ETH ? prevState.eth : prevState.lastEth,
          }
        ))
      })
  }

  priceChange(lastPrice, price) {
    const diffPrice = lastPrice - price
    const changePrice = diffPrice / lastPrice
    return (changePrice * 100).toFixed()
  }

  render() {
    const { name, symbol, price, lastPrice, eth, lastEth } = this.state
    const gainLoss = lastPrice > price ? 'loss' : 'gain'
    const ethGainLoss = lastEth > eth ? 'loss' : 'gain'
    return (
      <div className={`card${ethGainLoss}`}>
        <div>
          <div className="name">{ name }</div>
          <span>{ symbol }</span>
        </div>

        <div className="logo">
        </div>

        <div className={`price ${gainLoss}`}>
          ${ price } USD
        </div>

        <div className={`percentage ${gainLoss}`}>
          { this.priceChange(lastPrice, price) }
        </div>

        <div className={`eth ${ethGainLoss}`}>
          { eth } ethereum
        </div>

        <div className={`percentage ${ethGainLoss}`}>
          { this.priceChange(lastEth, eth) }
        </div>
      </div>
    )
  }
}

export default CryptoCard;
