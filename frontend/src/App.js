import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import EditUser from "./pages/EditUser";
import HomePage from "./pages/HomePage";
import Contact from "./pages/Contact";
import Register from "./components/Register";
import Login from "./components/Login";
import Locations from "./pages/Locations";
import AboutUs from "./pages/AboutUs";
import Historydatas from "./pages/Historydatas";
import ContactHome from "./pages/ContactHome";
import ForecastWeatherPage from "./pages/ForecastWeatherPage";
import Weatherdatas from "./pages/Weatherdatas";
import AboutApp from "./pages/AboutApp";
import ForecastReportsPage from "./pages/ForecastReportsPage";
import ForecastReportsDetailPage from "./pages/ForecastReportsDetailPage";

function App() {
	return (
		<div>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/aboutus" element={<AboutUs />} />
					<Route path="/aboutapp" element={<AboutApp />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/contact" element={<ContactHome />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/dashboard/contact" element={<Contact />} />
					<Route path="/dashboard/users" element={<Users />} />
					<Route path="/dashboard/users/edit/:id" element={<EditUser />} />
					<Route path="/dashboard/locations" element={<Locations />} />
					<Route path="/dashboard/weatherdatas" element={<Weatherdatas />} />
					<Route path="/dashboard/historydata" element={<Historydatas />} />
					<Route path="/dashboard/forecastweather" element={<ForecastWeatherPage />} />
					<Route path="/dashboard/forecastreports" element={<ForecastReportsPage />} />
					<Route path="/dashboard/forecastreports/report/:id" element={<ForecastReportsDetailPage />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
