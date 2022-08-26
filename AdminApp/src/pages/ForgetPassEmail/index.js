import React, { useState } from "react"
import { forgetPassEmail } from "../../redux/users/userActions"
import { useDispatch } from 'react-redux';

function ForgetPassEmail(props) {
    const dispatch = useDispatch();

    const [email, setEmail] = useState("")
    const [errors, setErrors] = useState("")


    const handleSubmit = async (e) => {
        e.preventDefault();
        const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (email == "") {
            setErrors("Email address is required!");
        } else if (!email.match(regexp)) {
            setErrors("Invalid email address!");
        } else {
            const data = {
                email: email
            }
            dispatch(forgetPassEmail(data))
        }

    }




    return (
        <>
            <div className="col-lg-12 col-md-12 forgot-password">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>Forget Password Email</h3>
                        <div>
                            <input type="email" className="form-control" onChange={e => setEmail(e.target.value)}
                                name="role" value={email} placeholder="Enter your email" />
                        </div>
                        <div>
                            {errors ? (
                                <div
                                    style={{ color: "#FE6E00" }}
                                    className="alert alert-danger"
                                >
                                    {errors}
                                </div>
                            ) : (
                                ""
                            )}

                            <button style={{ width: "100%" }} className="btn-default hvr-bounce-in nav-button mt-3" onClick={(e) => handleSubmit(e)}>Send Email</button>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default ForgetPassEmail
