import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import { faEye, faEyeSlash, faRefresh, faUnlock, faUser } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RegisterUser } from "../../redux/auth/authActions";
import { displayRoles } from "../../redux/roles/roleActions";
import LOGO from "../../assets/images/orbtx.svg";

const Index = () => {

    const dispatch = useDispatch();
    const roles = useSelector(state => state.role?.roles.roles);

    const initialUserState = { firstName: "", lastName: "", username: "", email: "", phoneNumber: "1234567", password: "", confirmPassword: "", referralCode: "" };
    const [user, setUser] = useState(initialUserState);
    const [errors, setErrors] = useState("");
    const [viewPass, setViewPass] = useState(0);
    const [viewCPass, setViewCPass] = useState(0);
    // const [code, setCode] = useState("");
    // const [refsCount, setRefCount] = useState(0);

    useEffect(() => {
        dispatch(displayRoles());
    }, []);

    // useEffect(() => {
    //   let inviteCode = JSON.parse(localStorage.getItem("code"))
    //   let refCount = JSON.parse(localStorage.getItem("refCount"))
    //   setCode(inviteCode);
    //   setRefCount(refCount ? (parseInt(refCount) + 1) : 0)
    // }, [])

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    };

    const handleSubmit = async () => {
        let roleId = '';
        roles?.forEach(element => {
            if (element.name == 'Master') {
                roleId = element._id
            }
        });

        const { firstName, lastName, username, email, password, confirmPassword, referralCode } = user;
        const exp = /^[a-z A-Z]+$/;
        const numCheck = /^[0-9]*$/;
        const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (firstName == "") {
            setErrors("First name is required!");
        } else if (!firstName.match(exp)) {
            setErrors("Invalid first name (Only letters a-z allowed)!");
        } else if (lastName == "") {
            setErrors("Last name is required!");
        } else if (!lastName.match(exp)) {
            setErrors("Invalid last name (Only letters a-z allowed)!");
        } else if (username == "") {
            setErrors("Username is required!");
        } else if (email == "") {
            setErrors("Email address is required!");
        } else if (!email.match(regexp)) {
            setErrors("Invalid email address!");
            // } else if (phoneNumber == "") {
            //     setErrors("Phone number is required!");
            // } else if (!phoneNumber.match(numCheck)) {
            //     setErrors("Invalid phone number!");
        } else if (password == "") {
            setErrors("Password is required!");
        } else if (password.length < 5) {
            setErrors("Password must have at-least 6 characters!");
        } else if (password !== confirmPassword) {
            setErrors("Password and Confirm Password does not match!");
        } else if (referralCode !== "" && referralCode.length < 24) {
            setErrors("Invalid referer code, valid referer code contains 24 characters!");
        } else {
            setErrors("");

            const myArray = referralCode.split("-");
            const code = myArray[0];
            const refsCount = parseInt(myArray[1]) + parseInt(1);

            const data = {
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                phone: user.phoneNumber,
                password: user.password,
                refererId: code,
                refCount: refsCount,
                roleId: roleId
            }
            dispatch(RegisterUser(data));
        }
    }

    return (
        <>
            <section className='register-orbtx'>
                <div className='welcomeback-page'>
                    <div className='registration-bg'>
                        <Link className="orbtx-logo" to="/">
                            <img src={LOGO} alt="" className='img-fluid' />
                        </Link>
                        <div className='login-bg-container'>
                            <h1>REGISTRATION</h1>
                            <div className="password-input-field">
                                <p className='text-white-light'>First name</p>
                                <div>
                                    <input type="text" className="text-light" placeholder="Type first name..." name='firstName' value={user.firstName} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="password-input-field">
                                <p className='text-white-light'>Last name</p>
                                <div>
                                    <input type="text" className="text-light" placeholder="Type last name..." name='lastName' value={user.lastName} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="password-input-field">
                                <p className='text-white-light'>Email</p>
                                <div>
                                    <input type="email" className="text-light" placeholder="Type your email..." name='email' value={user.email} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="password-input-field">
                                <p className='text-white-light'>Choose a password</p>
                                <div>
                                    <div onClick={() => setViewPass(!viewPass)}><FontAwesomeIcon className='faeye' icon={viewPass ? faEyeSlash : faEye} /></div>
                                    <input type={viewPass ? "text" : "password"} className="text-light" placeholder="Type your password..." name="password" value={user.password} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="password-input-field">
                                <p className='text-white-light'>Repeat password</p>
                                <div>
                                    <div onClick={() => setViewCPass(!viewCPass)}><FontAwesomeIcon className='faeye' icon={viewCPass ? faEyeSlash : faEye} /></div>
                                    <input type={viewCPass ? "text" : "password"} className="text-light" placeholder="Confirm password..." name="confirmPassword" value={user.confirmPassword} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="password-input-field">
                                <p className='text-white-light'>Username</p>
                                <div>
                                    <input type="text" className="text-light" placeholder="Type your username..." name='username' value={user.username} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="password-input-field">
                                <p className='text-white-light'>Referral Code</p>
                                <div>
                                    <input type="text" className="text-light" placeholder="Enter referral code..." name="referralCode" value={user.referralCode} onChange={handleChange} />
                                </div>
                            </div>
                            {errors ? (
                                <div style={{ color: "#FE6E00" }} className="alert alert-danger"> {errors} </div>
                            ) :
                                ("")
                            }
                            <div className='text-center'>
                                <button type="button" className="btn enter-btn" onClick={() => handleSubmit()}>
                                    SIGN UP
                                </button>
                            </div>
                            <div className="custom-support-icons">
                                {/* <Link to="/register"> */}
                                <div className='icon'>
                                    <div className='icon-svg text-green-bg'><FontAwesomeIcon icon={faUser} /></div>
                                    <div className="text-white-light text-green">Register</div>
                                </div>
                                {/* </Link> */}
                                <Link to="/restore">
                                    <div className='icon'>
                                        <div className='icon-svg'><FontAwesomeIcon icon={faRefresh} /></div>
                                        <div className="text-white-light">Restore</div>
                                    </div>
                                </Link>
                                <Link to="/login">
                                    <div className='icon'>
                                        <div className='icon-svg'><FontAwesomeIcon icon={faUnlock} /></div>
                                        <div className="text-white-light">Login</div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Index