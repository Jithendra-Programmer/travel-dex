import React, { useState } from 'react';
import Amadeus from 'amadeus';

export default function Home() {
    const amadeus = new Amadeus({
        clientId: '0OmWT9iH8EOHVZ7uVRFFVFKvNgKKn6tv',
        clientSecret: 'pTRT40yIncETqKFs',
    });

    const [city, setCity] = useState('jithendra');
    const [name, setName] = useState('');

    const searchCity = (value) => {
        setName(value);
        amadeus.referenceData.locations
            .get({
                keyword: value,
                subType: 'AIRPORT',
            })
            .then((res) => setCity(res.result.data))
            .catch((err) => console.log(err));
    };

    return (
        <div className=''>
            <input
                onChange={(event) => searchCity(event.target.value)}
                placeholder='search for city'
                value={name}
            />

            {/* { city.length === 0 ? (<h1>Start typing city</h1>) :
            <div>

                {city.map((cityName, key) => (
                    <h1 onClick={() => {setName(cityName.name)}} key={key} >{cityName.name}</h1>
                ))}

            </div>
            } */}

            <h1>{city}</h1>
        </div>
    );
}
