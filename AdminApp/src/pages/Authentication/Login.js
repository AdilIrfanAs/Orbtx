import React from "react";
import Header from '../../layout/Header';
import { useDispatch } from 'react-redux';
import { adminLogin } from "../../redux/auth/authActions";
import { withRouter, Link } from "react-router-dom";
import { useForm } from "react-hook-form";

const LoginPage = (props) => {

    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const userData = {
        email: {
            required: "Email is required",
            pattern: {
                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: 'Please enter a valid email',
            }
        },
        password: {
            required: "Password is required"
        }
    };

    const handleSave = async (formData) => {

        const data = {
            email: formData.email,
            password: formData.password
        }
        dispatch(adminLogin(data));
    }

    return (
        <>
            <Header />
            <div className="col-lg-12 col-md-12 login-page">
                <div className="content-wrapper">
                    <div className="content-box auth-box">
                        <h3>Login User</h3>
                        <form onSubmit={handleSubmit(handleSave)}>
                            <div className="form-group col-md-12">
                                <label className="control-label">Email</label>
                                <input type="email" className="form-control" placeholder="Enter email"
                                    {...register('email', userData.email)} name='email' />
                                {errors?.email && <span className="errMsg">{errors.email.message}</span>}
                            </div>
                            <div className="form-group col-md-12 pt-2">
                                <label className="control-label">Password</label>
                                <input type="password" className="form-control" placeholder="Enter password"
                                    {...register('password', userData.password)} name='password' />
                                {errors?.password && <span className="errMsg">{errors.password.message}</span>}
                            </div>
                            <div className="login-page-buttons">
                                <button className="btn-default w-100 hvr-bounce-in nav-button me-2" type="submit">Login</button>
                            </div>
                            <br />
                            <Link to='/admin/forget-password-email'>Forget Password</Link>
                            <br />
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default withRouter(LoginPage)
