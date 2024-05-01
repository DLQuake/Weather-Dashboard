import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const WeatherdatasList = () => {
    const [weatherdatas, setWeatherdatas] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const tableRef = useRef(null);

    useEffect(() => {
        getWeatherdata();
    }, []);

    const getWeatherdata = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:5000/weatherdata/all");
            setWeatherdatas(response.data.sort((a, b) => {
                if (a.location.city === b.location.city) {
                    return new Date(a.date) - new Date(b.date);
                }
                return a.location.city > b.location.city ? 1 : -1;
            }));
            const uniqueCities = [...new Set(response.data.map(weatherdata => weatherdata.location.city))];
            setCities(uniqueCities);
        } catch (error) {
            console.error("Wystąpił błąd podczas pobierania danych:", error);
        } finally {
            setLoading(false);
        }
    };

    const searchWeatherData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/weatherdata/filter", {
                params: {
                    city: selectedCity,
                    startDate: startDate ? moment(startDate).format('YYYY-MM-DD') : null,
                    endDate: endDate ? moment(endDate).format('YYYY-MM-DD') : null
                }
            });
            setWeatherdatas(response.data.sort((a, b) => {
                if (a.location.city === b.location.city) {
                    return new Date(a.date) - new Date(b.date);
                }
                return a.location.city > b.location.city ? 1 : -1;
            }));
            tableRef.current.scrollIntoView({ behavior: "smooth" });
        } catch (error) {
            console.error("Wystąpił błąd podczas pobierania danych:", error);
        }
    };

    const getWindDirection = (degrees) => {
        if (degrees >= 349 || degrees < 11) return "N";
        else if (degrees >= 12 && degrees < 33) return "NNE";
        else if (degrees >= 34 && degrees < 56) return "NE";
        else if (degrees >= 57 && degrees < 78) return "ENE";
        else if (degrees >= 79 && degrees < 101) return "E";
        else if (degrees >= 102 && degrees < 123) return "ESE";
        else if (degrees >= 124 && degrees < 146) return "SE";
        else if (degrees >= 147 && degrees < 168) return "SSE";
        else if (degrees >= 169 && degrees < 191) return "S";
        else if (degrees >= 192 && degrees < 213) return "SSW";
        else if (degrees >= 214 && degrees < 236) return "SW";
        else if (degrees >= 237 && degrees < 258) return "WSW";
        else if (degrees >= 259 && degrees < 281) return "W";
        else if (degrees >= 282 && degrees < 303) return "WNW";
        else if (degrees >= 304 && degrees < 326) return "NW";
        else if (degrees >= 326 && degrees < 348) return "NNW";
        else return "N";
    };

    const refreshData = async () => {
        try {
            setLoading(true); // Ustawienie stanu loadingu na true
            await axios.get("http://localhost:5000/weatherdata");
            await getWeatherdata();
            alert("Dane zostały zaktualizowane.");
        } catch (error) {
            console.error("Wystąpił błąd podczas odświeżania danych:", error);
            alert("Wystąpił błąd podczas odświeżania danych.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="title">Weather data list</h1>
            <div className="field pr-6">
                <label className="label">Select City:</label>
                <div className="control">
                    <div className="select is-striped is-fullwidth">
                        <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                            <option value="">Select city</option>
                            {cities.map((city, index) => (
                                <option key={index} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <label className="label">Select Date Range:</label>
            <div className="field pr-6">
                <div className="control">
                    <DatePicker
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="From - To"
                        onChange={(update) => {
                            setStartDate(update[0]);
                            setEndDate(update[1]);
                        }}
                        isClearable={true}
                        withPortal
                        className="input"
                    />
                </div>
            </div>
            <div className="field">
                <div className="control">
                    <button className="button is-link" onClick={searchWeatherData}>Search</button>
                </div>
            </div>
            <div className="field">
                <div className="control">
                    {loading ? (
                        <p className="title has-text-centered">Loading...</p>
                    ) : (
                        <div>
                            <button className="button is-primary" onClick={refreshData}>Refresh Data</button>
                            <table className="table is-striped is-fullwidth" ref={tableRef}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>City</th>
                                        <th>Date</th>
                                        <th>Temperature (°C)</th>
                                        <th>Humidity (%)</th>
                                        <th>Precipitation (mm)</th>
                                        <th>Wind Speed (Km/h)</th>
                                        <th>Wind Direction</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {weatherdatas.map((weatherdata, index) => (
                                        <tr key={weatherdata.uuid}>
                                            <td>{index + 1}</td>
                                            <td>{weatherdata.location.city}</td>
                                            <td>{moment(weatherdata.date).format("DD.MM.YYYY | HH:mm")}</td>
                                            <td>{weatherdata.temperature} °C</td>
                                            <td>{weatherdata.humidity} %</td>
                                            <td>{weatherdata.precipitation} mm</td>
                                            <td>{weatherdata.windSpeed} Km/h</td>
                                            <td>{getWindDirection(weatherdata.windDirection)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button className="button is-primary" onClick={refreshData}>Refresh Data</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WeatherdatasList;