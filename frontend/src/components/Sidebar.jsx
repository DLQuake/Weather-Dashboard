import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoPerson, IoHome, IoLogOut, IoMail, IoLocationSharp, IoCopySharp, IoCloudySharp, IoFileTrayStacked } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authSlice";

const Sidebar = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user } = useSelector((state) => state.auth);

	const logout = () => {
		dispatch(LogOut());
		dispatch(reset());
		navigate("/");
	};

	return (
		<div>
			<aside className="menu pl-2 has-shadow">
				<p className="menu-label">Main</p>
				<ul className="menu-list">
					<li>
						<NavLink to={"/dashboard"}>
							<IoHome /> Dashboard
						</NavLink>
					</li>
					<li>
						<NavLink to={"/dashboard/historydata"}>
							<IoCopySharp /> History Data
						</NavLink>
					</li>
					<li>
						<NavLink to={"/dashboard/forecastweather"}>
							<IoCloudySharp /> Forecast Weather
						</NavLink>
					</li>
				</ul>
				{user && user.role === "admin" && (
					<div>
						<p className="menu-label">Admin</p>
						<ul className="menu-list">
							<li>
								<NavLink to={"/dashboard/users"}>
									<IoPerson /> Users
								</NavLink>
							</li>
							<li>
								<NavLink to={"/dashboard/locations"}>
									<IoLocationSharp /> Locations
								</NavLink>
							</li>
							<li>
								<NavLink to={"/dashboard/weatherdatas"}>
									<IoCloudySharp /> Weather data
								</NavLink>
							</li>
						</ul>
					</div>
				)}
				<div>
					<p className="menu-label">User</p>
					<ul className="menu-list">
						<li>
							<NavLink to={"/dashboard/forecastreports"}>
								<IoFileTrayStacked /> Forecast reports
							</NavLink>
						</li>
						<li>
							<NavLink to={"/dashboard/contact"}>
								<IoMail /> Contact
							</NavLink>
						</li>
					</ul>
				</div>

				<p className="menu-label">Option</p>
				<ul className="menu-list">
					<li>
						<button onClick={logout} className="button is-white">
							<IoLogOut /> Sign out
						</button>
					</li>
				</ul>
			</aside>
		</div>
	);
};

export default Sidebar;
