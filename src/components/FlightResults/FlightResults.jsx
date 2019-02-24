import React, { Component, Fragment } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import Fligth from '../Flight/Flight.jsx';
import './FlightResults.scss';

class FlightResults extends Component {
  static defaultProps = {
    inbounds: [],
    outbounds: []
  };

  static propTypes = {
    inbounds: PropTypes.arrayOf(PropTypes.shape({})),
    outbounds: PropTypes.arrayOf(PropTypes.shape({}))
  };
  render() {
    const { inbounds, outbounds } = this.props;
    return (
      <div className="FormSearchResult">
        {!isEmpty(outbounds) && 
          <Fragment>
            <h2>Ida</h2>
            {outbounds.map(item => {
              return <Fligth key={item.id} {...item} />;
            })}
          </Fragment>
        }

        {!isEmpty(inbounds) && 
          <Fragment>
            <h2>Volta</h2>
            {inbounds.map(item => {
              return <Fligth key={item.id} {...item} />;
            })}
          </Fragment>
        }
      </div>
    );
  }
}

export default FlightResults;
