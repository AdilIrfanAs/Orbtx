import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RegisterSubAdmin, updateState } from "../../redux/auth/authActions";
import { displayRoles } from "../../redux/roles/roleActions";
import FullPageLoader from "../FullPageLoader/fullPageLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";

const AddSubAdmin = () => {

  const dispatch = useDispatch();
  const roles = useSelector((state) => state.role?.roles.roles);
  const registered = useSelector(state => state.auth?.registered);
  const error = useSelector(state => state.auth?.error);


  const [loader, setLoader] = useState(false);
  const history = useHistory();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const addSubAdmin = {
    firstname: {
      required: "First name is required",
      pattern: {
        value: /^[A-Za-z]*$/,
        message: 'Please enter only alphabets',
      }
    },
    lastname: {
      required: "Last name is required",
      pattern: {
        value: /^[A-Za-z]*$/,
        message: 'Please enter only alphabets',
      }
    },
    username: {
      required: "Username is required",
      pattern: {
        value: /^[a-zA-Z0-9_.-]*$/,
        message: 'Please enter only alphabets and numbers',
      }
    },
    email: {
      required: "Email is required",
      pattern: {
        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: 'Please enter a valid email',
      }
    },
    phone: {
      required: "Phone number is required",
      pattern: {
        value: /^[0-9]*$/,
        message: 'Please enter a valid contact number',
      }
    },
    password: {
      required: "Password is required",
      minLength: {
        value: 6,
        message: "Password must have at least 6 characters"
      }
    }
  };

  useEffect(() => {
    dispatch(displayRoles());
  }, []);

  useEffect(() => {
    if (registered) {
      setLoader(false);
      history.goBack();
    }
    dispatch(updateState())
  }, [registered])

  useEffect(() => {
    if (error) {
      setLoader(false);
      dispatch(updateState())
    }
  }, [error])

  const handleAddSubAdmin = (formData) => {

    let roleId = "";
    roles?.forEach((element) => {
      if (element.name == "Sub Admin") {
        roleId = element._id;
      }
    });

    setLoader(true);
    const data = {
      firstName: formData.firstname,
      lastName: formData.lastname,
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      roleId: roleId,
      password: formData.password,
    };

    dispatch(RegisterSubAdmin(data));
  };

  return (
    <>
      {loader ? (
        <FullPageLoader />
      ) : (
        <>
          {/* <div className="col-lg-9 col-md-8"> */}
          <div className="content-wrapper right-content-wrapper">
            <div className="content-box">
              <FontAwesomeIcon className="faArrowLeftIcon" icon={faArrowLeft} onClick={() => history.goBack()} />
              <h3>Add Sub Admin</h3>
              <form onSubmit={handleSubmit(handleAddSubAdmin)}>
                <div className="form-group col-md-12">
                  <label className="control-label">First Name</label>
                  <input type="text" className="form-control" placeholder="Enter First name"
                    {...register('firstname', addSubAdmin.firstname)} name='firstname' />
                  {errors?.firstname && <span className="errMsg">{errors.firstname.message}</span>}
                </div>
                <div className="form-group col-md-12 pt-2">
                  <label className="control-label">Last Name</label>
                  <input type="text" className="form-control" placeholder="Enter Last name"
                    {...register('lastname', addSubAdmin.lastname)} name='lastname' />
                  {errors?.lastname && <span className="errMsg">{errors.lastname.message}</span>}
                </div>
                <div className="form-group col-md-12 pt-2">
                  <label className="control-label">User Name</label>
                  <input type="text" className="form-control" placeholder="Enter Username"
                    {...register('username', addSubAdmin.username)} name='username' />
                  {errors?.username && <span className="errMsg">{errors.username.message}</span>}
                </div>
                <div className="form-group col-md-12 pt-2">
                  <label className="control-label">Email</label>
                  <input type="email" className="form-control" placeholder="Enter Email"
                    {...register('email', addSubAdmin.email)} name='email' />
                  {errors?.email && <span className="errMsg">{errors.email.message}</span>}
                </div>
                <div className="form-group col-md-12 pt-2">
                  <label className="control-label">Phone Number</label>
                  <input type="text" className="form-control" placeholder="Enter Phone number" name='phone'
                    {...register('phone', addSubAdmin.phone)} onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} />
                  {errors?.phone && <span className="errMsg">{errors.phone.message}</span>}
                </div>
                <div className="form-group col-md-12 pt-2">
                  <label className="control-label">Password</label>
                  <input type="password" className="form-control" placeholder="Enter Password"
                    {...register('password', addSubAdmin.password)} name='password' />
                  {errors?.password && <span className="errMsg">{errors.password.message}</span>}
                </div>
                <div>
                  <button className="btn btn-default" type="submit">Save</button>
                </div>
              </form>
            </div>
          </div>
        {/* </div> */}
        </>
      )}
    </>
  );
};

export default AddSubAdmin;
