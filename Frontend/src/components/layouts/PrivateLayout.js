import React, { useState, useEffect } from "react";
import Header from '../Header/Header';

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
		if (!localStorage.uToken) {
			if (localStorage.userInfo)
				window.location.href = '/welcome-back';
			else
				window.location.href = '/login';
		}
		// if (localStorage.userType == 'admin') {
		// 	axios.get("/admin/logout").then((errors) => { });
		// 	localStorage["userType"] = 'user';
		// } else {
		// 	localStorage["userType"] = 'user';
		// }
	}, []);

	return (
		localStorage.uToken ?
			<div className="wrapper">
				<Header />
				{children}
			</div>
			: null

	);
};
export default PrivateLayout;
