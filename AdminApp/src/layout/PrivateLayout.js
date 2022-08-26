import React, { useState, useEffect } from "react";
import Header from './Header';
import NavigationMenu from "./NavigationMenu";

const PrivateLayout = ({ title, children }) => {
	const [isActive, setActive] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState([]);

	const toggleClass = () => {
		setActive(!isActive);
	};

	useEffect(() => {
		if (title)
			document.title = title;
		else
			document.title = "OrbtX";
	}, [title]);

	useEffect(() => {
		if (!localStorage.token) {
			window.location.href = '/admin/login';
		}
	}, []);

	return (
		localStorage.token ?
			<>
				<Header />
				<div className="dashboard-wrapper main-padding">
					<div className="row">
						<NavigationMenu />
						{children}
					</div>
				</div>
			</>
			: null
	);
};
export default PrivateLayout;
