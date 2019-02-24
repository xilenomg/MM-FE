import React, { Component } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import airports from '../../../data/airports';
import './AirportInput.scss';

class AirportInput extends Component {
  static defaultProps = {
    value: '',
    onChange: () => {}
  };

  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.ref = null;
    this.state = {
      value: props.value,
      showList: false,
      list: []
    };
    this.onClickOutsideHandler = this.onClickOutsideHandler.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.fakeAirportRequest = this.fakeAirportRequest.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.onClickOutsideHandler);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onClickOutsideHandler);
  }

  fakeAirportRequest(value) {
    return new Promise(resolve => {
      const filteredAirports = airports.filter(item => {
        return (
          item.city.toUpperCase().indexOf(value.toUpperCase()) !== -1 ||
          item.initials.toUpperCase().indexOf(value.toUpperCase()) !== -1
        );
      });
      resolve(filteredAirports);
    });
  }

  onChangeHandler(event) {
    const { onChange } = this.props;
    const { value } = event.target;
    event.preventDefault();
    const data = {
      value,
      showList: false,
      list: []
    };
    if (value && value.length > 0) {
      this.fakeAirportRequest(value).then(airports => {
        this.setState({
          showList: airports.length > 0,
          list: airports
        });
      });
    }
    this.setState(
      () => {
        return data;
      },
      () => {
        onChange(value);
      }
    );
  }

  onClickHandler(item) {
    this.setState(
      {
        value: item.initials,
        showList: false
      },
      () => {
        const { onChange } = this.props;
        const { value } = this.state;
        onChange(value);
      }
    );
  }

  onClickOutsideHandler(event) {
    if (this.ref && !this.ref.contains(event.target)) {
      this.setState({
        showList: false
      });
    }
  }

  render() {
    const { ...props } = this.props;
    const { showList, value: stateValue, list } = this.state;

    return (
      <div
        className="AirportInput"
        ref={ref => {
          this.ref = ref;
        }}
      >
        <input {...props} onChange={this.onChangeHandler} value={stateValue} />
        {showList && !isEmpty(list) && 
          <div className="AirportInputList">
            {list.map(item => {
              return (
                <div
                  key={item.initials}
                  className="AirportInputListItem"
                  onClick={() => {
                    this.onClickHandler(item);
                  }}
                >
                  {`${item.city} (${item.initials})`}
                </div>
              );
            })}
          </div>
        }
      </div>
    );
  }
}
export default AirportInput;
