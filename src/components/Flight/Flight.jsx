import React, { Component } from 'react';
import { startCase, get } from 'lodash';
import PropTypes from 'prop-types';
import { formatFlightDate, formatFlightDuration } from '../Utils/flight';
import './Flight.scss';

class Flight extends Component {
  static defaultProps = {
    airline: '',
    duration: 0,
    departureDate: '',
    arrivalDate: '',
    flightNumber: '',
    pricing: {},
    from: '',
    to: '',
    stops: 0
  };

  static propTypes = {
    airline: PropTypes.string,
    duration: PropTypes.number,
    departureDate: PropTypes.string,
    arrivalDate: PropTypes.string,
    flightNumber: PropTypes.string,
    pricing: PropTypes.shape({}),
    from: PropTypes.string,
    to: PropTypes.string,
    stops: PropTypes.number
  };
  constructor(props) {
    super(props);

    this.getPriceDetails = this.getPriceDetails.bind(this);
  }

  getPriceDetails(pricing) {
    const airlinePrice = get(pricing, 'airline.saleTotal', 0) || get(pricing, 'ota.saleTotal', 0);
    const mmPrice = get(pricing, 'miles.saleTotal', 0);
    let discountValue = 0;
    let displayPrice = 0;

    // mm price and airline price exists
    if (mmPrice > 0 && airlinePrice > 0) {
      if (mmPrice < airlinePrice) {
        discountValue = airlinePrice - mmPrice;
        displayPrice = mmPrice;
      } else {
        discountValue = 0;
        displayPrice = airlinePrice;
      }
    }
    // only airline price exists
    else if (mmPrice) {
      discountValue = 0;
      displayPrice = mmPrice;
    }
    // only mm price exists
    else if (airlinePrice) {
      discountValue = 0;
      displayPrice = airlinePrice;
    }
    // none exists
    else {
      return null;
    }

    return {
      display: `R$${displayPrice.toFixed(2)}`,
      discount: discountValue > 0 ? `R$${discountValue.toFixed(2)}` : null
    };
  }

  render() {
    const {
      airline,
      duration,
      departureDate,
      arrivalDate,
      flightNumber,
      pricing,
      from,
      to,
      stops
    } = this.props;
    const pricingResult = this.getPriceDetails(pricing);

    if (!pricingResult) {
      return null;
    }

    return (
      <div className="Flight">
        <div className="FlightNumber">Vôo #{flightNumber}</div>
        <div className="FlightDates">
          <div className="FlightDeparture">
            <span className="FlightLabel">Saída:</span>
            <br />
            {from}
            <br />
            {formatFlightDate(departureDate)}
          </div>
          <div className="FlightArrival">
            <span className="FlightLabel">Chegada:</span>
            <br />
            {to}
            <br />
            {formatFlightDate(arrivalDate)}
          </div>
        </div>
        <div className="FlightExtraInfo">
          <div className="FlightDuration">
            <span className="FlightLabel">Duração:</span> {formatFlightDuration(duration)}
          </div>
          <div className="FlightStops">
            <span className="FlightLabel">Paradas:</span> {stops}
          </div>
        </div>
        <div className="FlightPricing">
          {pricingResult.discount && 
            <div>
              <span className="FlightLabel">Você economiza:</span>{' '}
              <span className="FlightPricingDiscount">{pricingResult.discount}</span>
            </div>
          }
          <span className="FlightPricingPrice">{pricingResult.display}</span>
        </div>
        <div className="FlightAirline">{startCase(airline)}</div>
      </div>
    );
  }
}
export default Flight;
