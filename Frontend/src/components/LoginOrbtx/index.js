import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import { faEye, faEyeSlash, faRefresh, faUnlock, faUser } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from "react-redux";
import { LoginUser, resendVerification, updateState } from "../../redux/auth/authActions";
import LOGO from "../../assets/images/orbtx.svg";
import { Modal } from 'react-bootstrap';

const Index = () => {

    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth?.user);
    const needPinCode = useSelector((state) => state.auth?.needPinCode);
    const qrCode = userData?.user?.[0]?.users.qrCode
    const [errors, setErrors] = useState("");
    const [user, setUser] = useState({ email: "", password: "" });
    const [status, setStatus] = useState(0);
    const [view, setView] = useState(0);
    const [message, setMessage] = useState("");
    const [resend, setResend] = useState('');
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [tfa, setTfa] = useState("");

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (needPinCode) {
            setShow(true)
            dispatch(updateState());
        }
    }, [needPinCode])

    const handleSubmit = async () => {
        const regexp =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const { email, password } = user;
        if (email == "") {
            setErrors("Please enter email first!");
        } else if (!email.match(regexp)) {
            setErrors("Invalid email!");
        } else if (password == "") {
            setErrors("Password is required!");
        } else {
            setErrors("");
            const data = {
                email: user.email,
                password: user.password,
                pincode: tfa
            };
            dispatch(LoginUser(data));
        }
    };

    useEffect(() => {
        let params = new URLSearchParams(window.location.search);
        if (params.get('status')) {
            if (params.get('status') == '200')
                setStatus(1)
            else
                setStatus(2)
        }
        if (params.get('message')) {
            setMessage(params.get('message'))
        }
        if (params.get('resend')) {
            setResend(params.get('resend'))
        }
        window.history.pushState({}, document.title, window.location.pathname);
    }, [])

    const resendEmail = () => {
        console.log(resend);
        dispatch(resendVerification(resend))
    }

    const verifySecret = () => {
        const data = {
            email: user.email,
            code: tfa
        }
        setTfa("")
        handleSubmit()
    }

    return (
        <>
            <section className='login-orbtx register-orbtx'>
                <div className='welcomeback-page'>
                    <div className='login-bg'>
                        <Link className="orbtx-logo" to="/">
                            <img src={LOGO} alt="" className='img-fluid' />
                        </Link>
                        <div className='login-bg-container'>
                            {status ?
                                <div className={"bar " + (status == 1 ? "bg-green" : "bg-red")}>
                                    <span className="bar-content d-flex justify-content-center align-items-center">
                                        <p className="mb-0">
                                            {message}{"   "}
                                            {resend ?
                                                <button type="button" onClick={() => resendEmail()} className="btn form-btn text-capitalize">
                                                    Resend Token
                                                </button>
                                                : ""
                                            }
                                        </p>
                                    </span>
                                </div>
                                : ""
                            }
                            <h1>LOGIN</h1>
                            <div className="password-input-field">
                                <p className='text-white-light'>Enter email </p>
                                <div>
                                    <input type="text" className="text-light" placeholder="Type your email..." name='email' value={user.email} onChange={(e) => handleChange(e)} />
                                </div>
                            </div>
                            <div className="password-input-field">
                                <p className='text-white-light'>Enter Password</p>
                                <div>
                                    <div onClick={() => setView(!view)}><FontAwesomeIcon className='faeye' icon={view ? faEyeSlash : faEye} /></div>
                                    <input type={view ? "text" : "password"} className="text-light" placeholder="Type your password..." name='password' value={user.password} onChange={(e) => handleChange(e)} />
                                </div>
                            </div>
                            {errors ? (
                                <div style={{ color: "#FE6E00" }} className="alert alert-danger">
                                    {" "}
                                    {errors}{" "}
                                </div>
                            ) : (
                                ""
                            )}
                            <div className='text-center'>
                                <button type="button" className="btn enter-btn" onClick={handleSubmit}>
                                    LOGIN
                                </button>
                            </div>
                            <div className="custom-support-icons">
                                <Link to="/register">
                                    <div className='icon'>
                                        <div className='icon-svg'><FontAwesomeIcon icon={faUser} /></div>
                                        <div className="text-white-light">Register</div>
                                    </div>
                                </Link>
                                <Link to="/restore">
                                    <div className='icon'>
                                        <div className='icon-svg'><FontAwesomeIcon icon={faRefresh} /></div>
                                        <div className="text-white-light">Restore</div>
                                    </div>
                                </Link>
                                <div className='icon'>
                                    <div className='icon-svg text-green-bg'><FontAwesomeIcon icon={faUnlock} /></div>
                                    <div className="text-white-light text-green">Login</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Modal show={show} onHide={handleClose} className="withdraw-details two-factor-auth" centered backdrop="static">
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <h3 className="text-white mb-3">Two factor authentication</h3>
                    <div className='mb-4'>
                        <img src={qrCode} alt="img" />
                    </div>
                    <input type="email" className="form-control mb-5" onChange={(e) => setTfa(e.target.value)}
                        name="tfa" value={tfa} placeholder="Enter 6 Digits OTP" />
                    <div className="limit-modal-btns">
                        <button type="button" onClick={handleClose} className="btn cancel">Cancel</button>
                        <button type="button" onClick={verifySecret} className="btn confirm">Confirm</button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Index