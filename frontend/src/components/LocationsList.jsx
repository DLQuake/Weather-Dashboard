import React, { useState, useEffect } from "react";
import axios from "axios";

const LocationsList = () => {
    const [locations, setLocations] = useState([]);
    const [cityName, setCityName] = useState("");
    const [searchCity, setSearchCity] = useState("");
    const [searchCountry, setSearchCountry] = useState("");
    const [locationAdded, setLocationAdded] = useState(false);

    useEffect(() => {
        getLocations();
    }, [locationAdded]);

    const getLocations = async () => {
        const response = await axios.get("http://localhost:5000/locations");
        setLocations(response.data);
    };

    const deleteLocations = async (locationId, cityName) => {
        try {
            const response = await axios.delete(`http://localhost:5000/weatherdata/delete?city=${cityName}`);
            if (response.status === 200) {
                await axios.delete(`http://localhost:5000/locations/${locationId}`);
                getLocations();
                alert("Dane pogodowe i lokalizacja zostały pomyślnie usunięte.");
            } else {
                alert("Usuwanie danych pogodowych nie powiodło się. Spróbuj ponownie.");
            }
        } catch (error) {
            console.error("Błąd podczas usuwania lokalizacji:", error);
            alert("Wystąpił błąd podczas usuwania danych lub lokalizacji. Spróbuj ponownie.");
        }
    };


    const AddLocation = async () => {
        if (!cityName) return;
        await axios.get(`http://localhost:5000/location/${cityName}`);
        setLocationAdded(true);
        setCityName("");
    };

    useEffect(() => {
        if (locationAdded) {
            axios.get(`http://localhost:5000/weatherdata`)
                .then(() => {
                    console.log("Dane pogodowe zostały pomyślnie pobrane po dodaniu lokalizacji.");
                    alert("Dane pogodowe zostały pomyślnie pobrane po dodaniu lokalizacji.");
                })
                .catch(error => {
                    console.error("Błąd podczas pobierania danych o pogodzie po dodaniu lokalizacji:", error);
                    alert("Błąd podczas pobierania danych o pogodzie po dodaniu lokalizacji:");
                })
                .finally(() => {
                    setLocationAdded(false);
                });
        }
    }, [locationAdded]);

    const filteredLocations = locations.filter(location => {
        const City = `${location.city}`.toLowerCase();
        const Country = `${location.country}`.toLowerCase();
        return City.includes(searchCity.toLowerCase()) && Country.includes(searchCountry.toLowerCase());
    });

    return (
        <div>
            <h1 className="title">Locations list</h1>
            <div className="field">
                <label className="label">Search by City name:</label>
                <div className="control">
                    <input
                        className="input"
                        type="text"
                        placeholder="Search by city name"
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                    />
                </div>
            </div>
            <div className="field">
                <label className="label">Search by Country name:</label>
                <div className="control">
                    <input
                        className="input"
                        type="text"
                        placeholder="Search by country name"
                        value={searchCountry}
                        onChange={(e) => setSearchCountry(e.target.value)}
                    />
                </div>
            </div>

            <label className="label">Add new location</label>
            <div className="field has-addons">
                <div className="control">
                    <input
                        className="input"
                        type="text"
                        placeholder="Enter city name"
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                    />
                </div>
                <div className="control">
                    <button className="button is-info" onClick={AddLocation}>Add Location</button>
                </div>
            </div>
            <table className="table is-striped is-fullwidth">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>City</th>
                        <th>Country</th>
                        <th>latitude</th>
                        <th>Longitude</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLocations.map((location, index) => (
                        <tr key={location.uuid}>
                            <td>{index + 1}</td>
                            <td>{location.city}</td>
                            <td>{location.country}</td>
                            <td>{location.latitude}</td>
                            <td>{location.longitude}</td>
                            <td>
                                <div className="Option">
                                    <button onClick={() => deleteLocations(location.uuid, location.city)} className="button is-small is-danger">Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LocationsList;
