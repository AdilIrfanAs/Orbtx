import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { editUser, singleSubAdmin } from '../../redux/users/userActions';
import FullPageLoader from '../FullPageLoader/fullPageLoader';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useForm } from 'react-hook-form';

const EditSubAdmin = () => {

   const [user, setUser] = useState('');
   let { id } = useParams();
   const [loader, setLoader] = useState(false);

   const dispatch = useDispatch();
   const userData = useSelector(state => state.users?.subAdmins.user);
   const history = useHistory();

   const { register, handleSubmit, formState: { errors } } = useForm();

   const editSubAdmin = {
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
      phone: {
         required: "Phone Number is required",
         pattern: {
            value: /^[0-9]*$/,
            message: 'Please enter a valid contact number',
         }
      }
   };

   useEffect(() => {
      dispatch(singleSubAdmin(id));
   }, []);

   useEffect(() => {
      setUser(userData);
   }, [userData]);

   const handleSave = (formData) => {
      setLoader(true);
      const data = {
         firstName: formData.firstname,
         lastName: formData.lastname,
         phone: formData.phone
      };
      dispatch(editUser(id, data));
      history.goBack();
   };

   return (
      <>
         {loader ? (<FullPageLoader />) : user && user ? (
            <>
               {/* <div className="col-lg-9 col-md-8"> */}
               <div className="content-wrapper right-content-wrapper">
                  <div className="content-box">
                     <FontAwesomeIcon className="faArrowLeftIcon" icon={faArrowLeft} onClick={() => history.goBack()} />
                     <h3>Edit Sub Admin</h3>
                     <form onSubmit={handleSubmit(handleSave)}>
                        <div className="form-group col-md-12">
                           <label className="control-label">First Name</label>
                           <input type="text" className="form-control" placeholder="Enter First name"
                              {...register('firstname', editSubAdmin.firstname)} name='firstname' defaultValue={user?.firstName} />
                           {errors?.firstname && <span className="errMsg">{errors.firstname.message}</span>}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Last Name</label>
                           <input type="text" className="form-control" placeholder="Enter Last name"
                              {...register('lastname', editSubAdmin.lastname)} name='lastname' defaultValue={user?.lastName} />
                           {errors?.lastname && <span className="errMsg">{errors.lastname.message}</span>}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">User Name</label>
                           <input type="text" className="form-control" placeholder="Enter Username"
                              {...register('username', editSubAdmin.username)} name='username' defaultValue={user?.username} disabled />
                           {errors?.username && <span className="errMsg">{errors.username.message}</span>}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Email</label>
                           <input type="email" className="form-control" placeholder="Enter Email"
                              {...register('email', editSubAdmin.email)} name='email' defaultValue={user?.email} disabled />
                           {errors?.email && <span className="errMsg">{errors.email.message}</span>}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <label className="control-label">Phone Number</label>
                           <input type="text" className="form-control" placeholder="Enter Phone number" name='phone' defaultValue={user?.phone}
                              {...register('phone', editSubAdmin.phone)} onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} />
                           {errors?.phone && <span className="errMsg">{errors.phone.message}</span>}
                        </div>
                        <div>
                           <button className="btn btn-default" type="submit">Save</button>
                        </div>
                     </form>
                  </div>
               </div>
            {/* </div> */}
            </>
         ) : ""
         }
      </>
   )
}

export default EditSubAdmin
