from flask import request, jsonify
from models import Location, WeatherData, db
from utils import train_random_forest
import pandas as pd
from datetime import datetime, timedelta
import numpy as np

def forecast_weather():
    try:
        city_name = request.args.get('city')
        days = int(request.args.get('days', 1))

        if not city_name:
            return jsonify({'error': 'City name missing in query parameter'}), 400

        location = Location.query.filter_by(city=city_name).first()

        if location:
            weather_data = location.weather_data
            df = pd.DataFrame([(data.date, data.temperature, data.humidity, data.precipitation, data.windSpeed, data.windDirection) for data in weather_data], columns=['date', 'temperature', 'humidity', 'precipitation', 'windSpeed', 'windDirection'])
            df['date'] = pd.to_datetime(df['date'])

            # Utworzenie modelu Random Forest Regressor dla temperatury
            X_temp = df[['humidity', 'precipitation', 'windSpeed', 'windDirection']]
            y_temp = df['temperature']

            model_temp = train_random_forest(X_temp, y_temp)

            # Utworzenie modelu Random Forest Regressor dla wilgotności
            X_humidity = df[['temperature', 'precipitation', 'windSpeed', 'windDirection']]
            y_humidity = df['humidity']

            model_humidity = train_random_forest(X_humidity, y_humidity)

            # Utworzenie modelu Random Forest Regressor dla opadów
            X_precipitation = df[['temperature', 'humidity', 'windSpeed', 'windDirection']]
            y_precipitation = df['precipitation']

            model_precipitation = train_random_forest(X_precipitation, y_precipitation)

            # Utworzenie modelu Random Forest Regressor dla prędkości wiatru
            X_windSpeed = df[['temperature', 'humidity', 'precipitation', 'windDirection']]
            y_windSpeed = df['windSpeed']

            model_windSpeed = train_random_forest(X_windSpeed, y_windSpeed)

            # Utworzenie modelu Random Forest Regressor dla kierunku wiatru
            X_windDirection = df[['temperature', 'humidity', 'precipitation', 'windSpeed']]
            y_windDirection = df['windDirection']

            model_windDirection = train_random_forest(X_windDirection, y_windDirection)

            # Przewidywanie dla przyszłych dat
            forecast_dates = [df['date'].max() + timedelta(hours=i) for i in range(1, 24 * days + 1)]
            forecast_data = pd.DataFrame({
                'humidity': np.linspace(df['humidity'].min(), df['humidity'].max(), num=len(forecast_dates)),
                'precipitation': np.linspace(df['precipitation'].min(), df['precipitation'].max(), num=len(forecast_dates)),
                'windSpeed': np.linspace(df['windSpeed'].min(), df['windSpeed'].max(), num=len(forecast_dates)),
                'windDirection': np.linspace(df['windDirection'].min(), df['windDirection'].max(), num=len(forecast_dates))
            })

            forecast_data['temperature'] = model_temp.predict(forecast_data[['humidity', 'precipitation', 'windSpeed', 'windDirection']])
            forecast_data['humidity'] = model_humidity.predict(forecast_data[['temperature', 'precipitation', 'windSpeed', 'windDirection']])
            forecast_data['precipitation'] = model_precipitation.predict(forecast_data[['temperature', 'humidity', 'windSpeed', 'windDirection']])
            forecast_data['windSpeed'] = model_windSpeed.predict(forecast_data[['temperature', 'humidity', 'precipitation', 'windDirection']])
            forecast_data['windDirection'] = model_windDirection.predict(forecast_data[['temperature', 'humidity', 'precipitation', 'windSpeed']])

            # Zaokrąglenie wartości
            forecast_data['temperature'] = forecast_data['temperature'].round(1)
            forecast_data['humidity'] = forecast_data['humidity'].astype(int)
            forecast_data['precipitation'] = forecast_data['precipitation'].round(1)
            forecast_data['windSpeed'] = forecast_data['windSpeed'].round(1)
            forecast_data['windDirection'] = forecast_data['windDirection'].astype(int)

            forecast_data['date'] = forecast_dates

            # Tworzenie końcowego JSON
            forecast_json = {
                'future_dates': [date.strftime('%Y-%m-%dT%H:%M') for date in forecast_dates],
                'forecast_temperature': forecast_data['temperature'].tolist(),
                'forecast_humidity': forecast_data['humidity'].tolist(),
                'forecast_precipitation': forecast_data['precipitation'].tolist(),
                'forecast_windSpeed': forecast_data['windSpeed'].tolist(),
                'forecast_windDirection': forecast_data['windDirection'].tolist()
            }

            return jsonify(forecast_json)
        else:
            return jsonify({'error': 'No location data found for the specified location'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
