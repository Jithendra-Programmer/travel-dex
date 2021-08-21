import React, { useState } from 'react';
import Card from './Card';
import Amadeus from 'amadeus';

function Main() {
    const amadeus = new Amadeus({
        clientId: '0OmWT9iH8EOHVZ7uVRFFVFKvNgKKn6tv',
        clientSecret: 'pTRT40yIncETqKFs',
    });

    const detailes = {};

    const [originCity, setOriginCity] = useState('');
    const [destinationCity, setDestinationCity] = useState('');
    const [destinationCities, setDestinationCities] = useState([]);
    const [originCities, setOriginCities] = useState([]);
    const [flightOffers, setFlightOffers] = useState([]);

    const searchCity = async (value, cities) => {
        await amadeus.referenceData.locations
            .get({
                keyword: value,
                subType: 'AIRPORT',
            })
            .then((res) => cities(res.result.data))
            .catch((err) => console.log(err));
    };

    const originCitySearch = (event) => {
        if (event !== '') {
            searchCity(event, setOriginCities);
        }
        setOriginCity(event);
    };

    const destinationCitySearch = (event) => {
        if (event !== '') {
            searchCity(event, setDestinationCities);
        }
        setDestinationCity(event);
    };

    const readValue = (property, value) => {
        // console.log(property, value)
        detailes[property] = value;
        // console.log(detailes)
    };

    const searchFlight = async () => {
        // console.log('Button clicked')

        console.log(detailes);
        console.log(destinationCity);
        console.log(originCity);

        await amadeus.shopping.flightOffersSearch
            .get({
                originLocationCode: originCity,
                destinationLocationCode: destinationCity,
                departureDate: detailes.departureDate,
                adults: detailes.adults,
            })
            .then(async (res) => {
                let data = { result: [] };

                res.result.data.forEach((result) => {
                    if (
                        result.itineraries[0].segments[0].departure.iataCode ===
                            originCity &&
                        result.itineraries[0].segments[0].arrival.iataCode ===
                            destinationCity
                    ) {
                        data.result.push({
                            departure:
                                result.itineraries[0].segments[0].departure,
                            arrival: result.itineraries[0].segments[0].arrival,
                            duration:
                                result.itineraries[0].segments[0].duration,
                            price: result.price.total,
                            flightCode: result.validatingAirlineCodes[0],
                            aircraftCode:
                                result.itineraries[0].segments[0].aircraft.code,
                        });
                    }
                });

                data.flights = res.result.dictionaries.carriers;
                data.aircrafts = res.result.dictionaries.aircraft;

                data.result.forEach(async (i) => {
                    i.flightName = data.flights[i.flightCode];
                    i.aircraftName = data.aircrafts[i.aircraftCode];
                });

                console.log(data.result);
                setFlightOffers(data.result);
            });
    };

    return (
        <>
            <section className='banner'>
                <div className='banner-detailS'>
                    <h1 className='banner-heading'>Book Your Flight Now</h1>
                    <div className='flight-search container'>
                        <input
                            onChange={(event) => {
                                originCitySearch(event.target.value);
                            }}
                            className='left-search input'
                            type='search'
                            placeholder='Origin Place'
                            value={originCity}
                        />

                        <input
                            onChange={(event) => {
                                destinationCitySearch(event.target.value);
                            }}
                            className='left-search input'
                            type='search'
                            placeholder='Destination place'
                            value={destinationCity}
                        />
                        <input
                            onChange={(event) => {
                                readValue('adults', event.target.value);
                            }}
                            className='right-search input'
                            type='number'
                            placeholder='Adults'
                        />
                        <div className='date left-search'>
                            <label>Departure Date</label>
                            <input
                                onChange={(event) => {
                                    readValue(
                                        'departureDate',
                                        event.target.value,
                                    );
                                }}
                                className='input'
                                type='date'
                            />
                        </div>
                        <div className='date left-search'>
                            <label>Return Date</label>
                            <input
                                onChange={(event) => {
                                    readValue('returnDate', event.target.value);
                                }}
                                className='input'
                                type='date'
                                placeholder='yyyy-mm-dd'
                                data-date-format='yyyy-mm-dd'
                            />
                        </div>
                        <button
                            onClick={() => searchFlight()}
                            className='right-search btn banner-btn'
                            type='button'
                        >
                            Search Flight
                        </button>
                    </div>

                    {originCities.length === 0 || originCity === '' ? (
                        <></>
                    ) : (
                        <div className='origin-cities cities'>
                            {originCities.map((cityName, key) => (
                                <h1
                                    onClick={() => {
                                        setOriginCity(cityName.iataCode);
                                        setOriginCities('');
                                        // readValue("originCity", cityName.name)
                                    }}
                                    key={key}
                                >{`${cityName.name}, ${cityName.address['cityName']}`}</h1>
                            ))}
                        </div>
                    )}

                    {destinationCities.length === 0 ||
                    destinationCity === '' ? (
                        <></>
                    ) : (
                        <div className='destination-cities cities'>
                            {destinationCities.map((cityName, key) => (
                                <h1
                                    onClick={() => {
                                        setDestinationCity(cityName.iataCode);
                                        setDestinationCities('');
                                        // readValue("destinationCity", cityName.name)
                                    }}
                                    key={key}
                                >
                                    {`${cityName.name}, ${cityName.address['cityName']}`}
                                </h1>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {flightOffers.length === 0 ? (
                <></>
            ) : (
                <div className='container cards'>
                    <h1>Best Offers</h1>
                    <div className='cards-container'>
                        {flightOffers.length === 0 ? (
                            <h1>Loading</h1>
                        ) : (
                            flightOffers.map((flightData, key) => (
                                <Card key={key} data={flightData} />
                            ))
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Main;
