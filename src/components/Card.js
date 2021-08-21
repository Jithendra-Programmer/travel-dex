import React, { useEffect } from 'react';
import Amadeus from 'amadeus';
import arrowIcon from './images/arrow-down.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const cityNameStyle = {
    fontSize: '12px',
    textAlign: 'center',
    marginBottom: '0px',
};

const cityDataContainer = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '40%',
};

const cityContainer = {
    display: 'flex',
    width: '36%',
    justifyContent: 'space-between',
};

const arrowContainer = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '40px',
    fontWeight: '900',
};

const flightContainer = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '0px',
    padding: '0px 30px',
    'border-right': '1px solid lightgray',
    'border-left': '1px solid lightgray',
};

// const dateContainer = {
//     display: 'flex',
//     width: 'auto',
//     justifyContent: 'space-between',
// };

// const durationStyle = {
//     fontSize: '12px',
//     padding: '10px 0px',
// };

export default function Card(props) {
    const amadeus = new Amadeus({
        clientId: '0OmWT9iH8EOHVZ7uVRFFVFKvNgKKn6tv',
        clientSecret: 'pTRT40yIncETqKFs',
    });

    const [flightData] = useState(props.data);
    const [originCity, setOriginCity] = useState('Loading');
    const [originAirport, setOriginAirport] = useState('Loading');
    const [destinationCity, setDestinationCity] = useState('Loading');
    const [destinationAirport, setDestinationAirport] = useState('Loading');
    const [price, setPrice] = useState('Loading');
    const [duration] = useState(
        flightData.duration.replace(/PT(\d+)H(\d+)M/, '$1 h $2 m'),
    );
    const [departureDate] = useState(flightData.departure.at.split('T')[0]);
    const [departureTime] = useState(
        flightData.departure.at.split('T')[1].slice(0, 5),
    );
    const [arrivalDate] = useState(flightData.arrival.at.split('T')[0]);
    const [arrivalTime] = useState(
        flightData.arrival.at.split('T')[1].slice(0, 5),
    );

    useEffect(() => {
        fetch('https://api.exchangerate-api.com/v4/latest/eur')
            .then((res) => res.json())
            .then((data) => {
                setPrice((flightData.price * data.rates.INR).toFixed());
            });

        amadeus.referenceData.locations
            .get({
                keyword: flightData.departure.iataCode,
                subType: 'AIRPORT',
            })
            .then((response) => {
                setOriginAirport(response.result.data[0].name);
                setOriginCity(response.result.data[0].address.cityName);
            });

        amadeus.referenceData.locations
            .get({
                keyword: flightData.arrival.iataCode,
                subType: 'AIRPORT',
            })
            .then((response) => {
                setDestinationAirport(response.result.data[0].name);
                setDestinationCity(response.result.data[0].address.cityName);
            });
    });

    console.log(flightData);

    return (
        <div className='card'>
            <div style={flightContainer} className='card-title'>
                <p style={{ marginBottom: 'auto' }}>
                    {flightData.aircraftName
                        .toLowerCase()
                        .split(' ')
                        .map(
                            (letter) =>
                                letter.charAt(0).toUpperCase() +
                                letter.substring(1),
                        )
                        .join(' ')}
                </p>
                <p
                    style={{
                        textAlign: 'center',
                        fontSize: '16px',
                        marginBottom: 'auto',
                    }}
                >
                    {flightData.flightName
                        .toLowerCase()
                        .split(' ')
                        .map(
                            (letter) =>
                                letter.charAt(0).toUpperCase() +
                                letter.substring(1),
                        )
                        .join(' ')}
                </p>
            </div>

            <div style={cityContainer}>
                <div style={cityDataContainer} className='card-title'>
                    <p style={{ marginBottom: '6px', fontSize: '16px' }}>
                        {originAirport
                            .toLowerCase()
                            .split(' ')
                            .map(
                                (letter) =>
                                    letter.charAt(0).toUpperCase() +
                                    letter.substring(1),
                            )
                            .join(' ')}
                    </p>
                    <p style={cityNameStyle}>
                        {originCity
                            .toLowerCase()
                            .split(' ')
                            .map(
                                (letter) =>
                                    letter.charAt(0).toUpperCase() +
                                    letter.substring(1),
                            )
                            .join(' ')}
                    </p>
                </div>

                <div style={arrowContainer} className='card-title'>
                    <FontAwesomeIcon icon={faLongArrowAltRight} />
                </div>

                <div style={cityDataContainer} className='card-title'>
                    <p style={{ marginBottom: '6px', fontSize: '16px' }}>
                        {destinationAirport
                            .toLowerCase()
                            .split(' ')
                            .map(
                                (letter) =>
                                    letter.charAt(0).toUpperCase() +
                                    letter.substring(1),
                            )
                            .join(' ')}
                    </p>
                    <p style={cityNameStyle}>
                        {destinationCity
                            .toLowerCase()
                            .split(' ')
                            .map(
                                (letter) =>
                                    letter.charAt(0).toUpperCase() +
                                    letter.substring(1),
                            )
                            .join(' ')}
                    </p>
                </div>
            </div>

            <h1 className='card-price'>&#8377;{price}</h1>

            <div className='date-and-time-container'>
                <div className='card-title date-container'>
                    <p style={{ textAlign: 'center', marginBottom: '0px' }}>
                        {departureTime}
                    </p>
                    <p style={{ fontSize: '12px', marginBottom: '0px' }}>
                        {departureDate}
                    </p>
                </div>

                <div className='duration'>
                    <p>{duration}</p>
                </div>

                <div className='card-title date-container'>
                    <p style={{ textAlign: 'center', marginBottom: '0px' }}>
                        {arrivalTime}
                    </p>
                    <p style={{ fontSize: '12px', marginBottom: '0px' }}>
                        {arrivalDate}
                    </p>
                </div>
            </div>

            <button className='btn card-btn'>
                Book Now
                <img src={arrowIcon} alt='' />
            </button>
        </div>
    );
}
