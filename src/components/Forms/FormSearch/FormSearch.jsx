import React, { Component } from 'react';
import request from '../../Utils/request';
import './FormSearch.scss';
import '../../../assets/styles/form.scss';
import { get } from 'lodash';

class FormSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tripType: 'RT',
      from: 'CNF',
      to: 'BSB',
      outboundDate: '2019-10-11',
      inboundDate: '2019-10-22',
      adults: 1,
      children: 0,
      infants: 0,
      cabin: 'EC',
      requestData: {
        requestLoading: false,
        errorMessage: null,
        result: null
      }
    };

    this.isLoading = this.isLoading.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
  }

  onFormSubmit(event) {
    event.preventDefault();
    const { requestData, ...state } = this.state;
    const data = {
      ...state
    };
    this.setLoading(true);
    request('post', `/search?time=${Date.now()}`, data)
      .then(result => {
        this.setState({
          requestData: {
            ...requestData,
            errorMessage: null,
            result: result.data
          }
        })
      })
      .catch((err) => {
        this.setState({
          requestData:{
            ...requestData,
            errorMessage: get(err, 'response.data.message', null),
            result: null
          }
        })
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  isLoading() {
    const { requestData: {requestLoading} } = this.state;
    return requestLoading;
  }

  setLoading(value) {
    const { requestData } = this.state;
    this.setState({
      requestData: {
        ...requestData,
        requestLoading: value
      }
    });
  }

  onChangeHandler(event) {
    const { name, value } = event.target;
    const field = name;
    const newValue = value;
    this.setState(
      {
        [field]: newValue
      },
      () => {
        console.log('this.state: ', this.state);
      }
    );
  }

  render() {
    const {
      tripType,
      from,
      to,
      outboundDate,
      inboundDate,
      adults,
      children,
      infants,
      cabin
    } = this.state;
    return (
      <div className="FormSearch">
        <h1>Busca por vôos</h1>
        <form onSubmit={this.onFormSubmit}>
          <div className="formRow tripType">
            <div>
              <label htmlFor="roundTripType">Round Trip</label>
              <input
                type="radio"
                name="tripType"
                id="roundTripType"
                value="RT"
                checked={tripType === 'RT'}
                onChange={this.onChangeHandler}
              />
            </div>
            <div>
              <label htmlFor="oneWayTripType">One Way Trip</label>
              <input
                type="radio"
                name="tripType"
                id="oneWayTripType"
                value="OW"
                checked={tripType === 'OW'}
                onChange={this.onChangeHandler}
              />
            </div>
          </div>
          <div className="formRow">
            <label htmlFor="from">De:</label>
            <input
              type="text"
              name="from"
              id="from"
              value={from}
              onChange={this.onChangeHandler}
            />
          </div>
          <div className="formRow">
            <label htmlFor="to">Para:</label>
            <input
              type="text"
              name="to"
              id="to"
              value={to}
              onChange={this.onChangeHandler}
            />
          </div>
          <div className="formRow">
            <label htmlFor="outboundDate">Data partida:</label>
            <input
              type="text"
              name="outboundDate"
              id="outboundDate"
              value={outboundDate}
              onChange={this.onChangeHandler}
            />
          </div>
          <div className="formRow">
            <label htmlFor="inboundDate">Data retorno:</label>
            <input
              type="text"
              name="inboundDate"
              id="inboundDate"
              value={inboundDate}
              onChange={this.onChangeHandler}
            />
          </div>

          <div className="formRow">
            <label htmlFor="adults">Adultos:</label>
            <input
              type="number"
              name="adults"
              id="adults"
              value={adults}
              onChange={this.onChangeHandler}
            />
          </div>
          <div className="formRow">
            <label htmlFor="children">Crianças:</label>
            <input
              type="number"
              name="children"
              id="children"
              value={children}
              onChange={this.onChangeHandler}
            />
          </div>
          <div className="formRow">
            <label htmlFor="infants">Bebês:</label>
            <input
              type="number"
              name="infants"
              id="infants"
              value={infants}
              onChange={this.onChangeHandler}
            />
          </div>

          <div className="formRow">
            <label htmlFor="cabin">Econômica</label>
            <input
              type="radio"
              checked={cabin === 'EC'}
              name="cabin"
              id="cabin"
              value="EC"
              onChange={this.onChangeHandler}
            />
          </div>

          <div>
            <button
              type="submit"
              className="primaryButton"
              disabled={this.isLoading()}
            >
              {this.isLoading() ? 'Carregando' : 'Procurar vôos'}
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default FormSearch;
