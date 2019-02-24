import React, { Component, Fragment } from "react";
import { get, isEmpty } from "lodash";
import axios from "axios";
import DatePicker from "react-date-picker";
import { formatTripDate } from "../../Utils/flight";
import FlightResults from "../../FlightResults/FlightResults.jsx";
import AirportInput from "../AirportInput/AirportInput.jsx";
import request from "../../Utils/request";
import "./FormSearch.scss";
import "../../../assets/styles/form.scss";

class FormSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        tripType: "RT",
        from: "",
        to: "",
        outboundDate: new Date(),
        inboundDate: new Date(),
        adults: 1,
        children: 0,
        infants: 0,
        cabin: "EC"
      },
      requestSearchData: {
        requestLoading: false,
        errorMessage: null,
        result: null
      },
      requestFlightData: {
        errorMessage: null,
        result: null
      }
    };

    this.isLoading = this.isLoading.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.requestSearch = this.requestSearch.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.clearFlightData = this.clearFlightData.bind(this);
    this.requestFlightData = this.requestFlightData.bind(this);
    this.onToAirportChangeHandler = this.onToAirportChangeHandler.bind(this);
    this.onInboundDateChangeHandler = this.onInboundDateChangeHandler.bind(
      this
    );
    this.onFromAirportChangeHandler = this.onFromAirportChangeHandler.bind(
      this
    );
    this.onOutboundDateChangeHandler = this.onOutboundDateChangeHandler.bind(
      this
    );
  }

  clearFlightData() {
    this.setState({
      requestFlightData: {
        errorMessage: null,
        result: null
      }
    });
  }

  requestFlightData() {
    const { requestSearchData } = this.state;
    const searchId = get(requestSearchData, "result.id", null);
    const airlines = get(requestSearchData, "result.airlines", []);
    if (searchId && !isEmpty(airlines)) {
      const flightRequests = [];
      airlines.forEach(item => {
        const flightFound = get(item, "status.enable", false);

        if (flightFound) {
          flightRequests.push(
            request(
              "get",
              `/search/${searchId}/flights?airline=${item.label}`
            ).then(result => {
              return get(result, "data", null);
            })
          );
        }
      });
      const self = this;
      axios
        .all(flightRequests)
        .then(
          axios.spread(function() {
            if (!isEmpty(arguments)) {
              const keys = Object.keys(arguments);
              let inbounds = [];
              let outbounds = [];
              keys.map(item => {
                const inbound = get(arguments[item], "inbound", []);
                const outbound = get(arguments[item], "outbound", []);
                inbounds = [...inbounds, ...inbound];
                outbounds = [...outbounds, ...outbound];
              });
              self.setState({
                requestFlightData: {
                  errorMessage: null,
                  result: {
                    inbounds,
                    outbounds
                  }
                }
              });
            }
          })
        )
        .catch(err => {
          const { requestSearchData } = this.state;
          this.setState({
            requestSearchData: {
              ...requestSearchData,
              errorMessage: get(err, "response.data.message", null),
            }
          });
        })
        .finally(() => {
          this.setLoading(false);
        });
    }
  }

  requestSearch() {
    const {
      fields: {
        adults,
        children,
        infants,
        outboundDate,
        inboundDate,
        ...fields
      }
    } = this.state;
    const data = {
      adults: parseInt(adults),
      children: parseInt(children),
      infants: parseInt(infants),
      outboundDate: formatTripDate(outboundDate),
      inboundDate: formatTripDate(inboundDate),
      ...fields
    };
    this.clearFlightData();
    this.setLoading(true, () => {
      request("post", `/search?time=${Date.now()}`, data)
        .then(result => {
          const { requestSearchData } = this.state;
          this.setState(
            {
              requestSearchData: {
                ...requestSearchData,
                errorMessage: null,
                result: result.data
              }
            },
            () => {
              this.requestFlightData();
            }
          );
        })
        .catch(err => {
          const { requestSearchData } = this.state;
          this.setState({
            requestSearchData: {
              ...requestSearchData,
              errorMessage: get(err, "response.data.message", null),
              result: null
            }
          });
          this.setLoading(false);
        });
    });
  }

  onFormSubmit(event) {
    event.preventDefault();
    this.requestSearch();
  }

  isLoading() {
    const {
      requestSearchData: { requestLoading }
    } = this.state;
    return requestLoading;
  }

  setLoading(value, callback) {
    const { requestSearchData } = this.state;
    this.setState(
      {
        requestSearchData: {
          ...requestSearchData,
          requestLoading: value
        }
      },
      callback
    );
  }

  onChangeHandler(event) {
    const { name, value } = event.target;
    this.setState((state) => ({
      fields: {
        ...state.fields,
        [name]: value
      }
    }));
  }

  onToAirportChangeHandler(value) {
    this.setState((state) => ({
      fields: {
        ...state.fields,
        to: value
      }
    }));
  }

  onFromAirportChangeHandler(value) {
    this.setState((state) => ({
      fields: {
        ...state.fields,
        from: value
      }
    }));
  }

  onOutboundDateChangeHandler(date) {
    this.setState((state) => ({
      fields: {
        ...state.fields,
        outboundDate: date
      }
    }));
  }

  onInboundDateChangeHandler(date) {
    this.setState((state) => ({
      fields: {
        ...state.fields,
        inboundDate: date
      }
    }));
  }

  render() {
    const {
      fields: {
        tripType,
        from,
        to,
        outboundDate,
        inboundDate,
        adults,
        children,
        infants,
        cabin
      },
      requestFlightData,
      requestSearchData
    } = this.state;

    const { errorMessage } = requestSearchData;
    return (
      <Fragment>
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
                  checked={tripType === "RT"}
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
                  checked={tripType === "OW"}
                  onChange={this.onChangeHandler}
                />
              </div>
            </div>
            <div className="formRow">
              <label htmlFor="from">De:</label>
              <AirportInput
                type="text"
                name="from"
                id="from"
                required
                autoComplete="off"
                value={from}
                onChange={this.onFromAirportChangeHandler}
              />
            </div>
            <div className="formRow">
              <label htmlFor="to">Para:</label>
              <AirportInput
                type="text"
                name="to"
                id="to"
                required={tripType === "RT"}
                disabled={tripType !== "RT"}
                autoComplete="off"
                value={to}
                onChange={this.onToAirportChangeHandler}
              />
            </div>
            <div className="formRow">
              <label htmlFor="outboundDate">Data partida:</label>
              <br />
              <DatePicker
                onChange={this.onOutboundDateChangeHandler}
                name="outboundDate"
                id="outboundDate"
                value={outboundDate}
                minDate={new Date()}
              />
            </div>
            <div className="formRow">
              <label htmlFor="inboundDate">Data retorno:</label>
              <br />
              <DatePicker
                onChange={this.onInboundDateChangeHandler}
                name="inboundDate"
                id="inboundDate"
                value={inboundDate}
                required={tripType === "RT"}
                disabled={tripType !== "RT"}
                minDate={new Date()}
              />
            </div>
            <div className="passengers">
              <div className="passengersType">
                <label htmlFor="adults">Adultos:</label>
                <input
                  type="number"
                  name="adults"
                  id="adults"
                  min="0"
                  max="9"
                  value={adults}
                  onChange={this.onChangeHandler}
                />
              </div>
              <div className="passengersType">
                <label htmlFor="children">Crianças:</label>
                <input
                  type="number"
                  name="children"
                  id="children"
                  min="0"
                  max="9"
                  value={children}
                  onChange={this.onChangeHandler}
                />
              </div>
              <div className="passengersType">
                <label htmlFor="infants">Bebês:</label>
                <input
                  type="number"
                  name="infants"
                  id="infants"
                  min="0"
                  max="9"
                  value={infants}
                  onChange={this.onChangeHandler}
                />
              </div>
            </div>

            <div className="formRow">
              <label htmlFor="cabin">Econômica</label>
              <input
                type="radio"
                checked={cabin === "EC"}
                name="cabin"
                id="cabin"
                value="EC"
                onChange={this.onChangeHandler}
              />
            </div>

            {errorMessage && 
              <div className="mainErrorMessage">{errorMessage}</div>
            }

            <div>
              <button
                type="submit"
                className="primaryButton"
                disabled={this.isLoading()}
              >
                {this.isLoading() ? "Carregando" : "Procurar vôos"}
              </button>
            </div>
          </form>
        </div>

        {requestFlightData && requestFlightData.result && 
          <FlightResults
            inbounds={requestFlightData.result.inbounds}
            outbounds={requestFlightData.result.outbounds}
          />
        }
      </Fragment>
    );
  }
}

export default FormSearch;
