import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPermission, updateState } from "../../redux/permissions/permissionActions";
import FullPageLoader from "../FullPageLoader/fullPageLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";

const AddPermission = () => {

  const history = useHistory();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const success = useSelector((state) => state.permission?.success);
  console.log(success, "success");
  const error = useSelector((state) => state.permission.error);

  const { register, handleSubmit, reset, formState: { isSubmitSuccessful, errors } } = useForm();

  const addPerm = {
    name: {
      required: "Permission name is required",
      pattern: {
        value: /^[A-Za-z_]*$/,
        message: 'Please enter only alphabets and underscore',
      }
    }
  };

  const handleSave = (formData) => {
    setLoader(true);
    const data = { name: formData.name };
    dispatch(addPermission(data));
  };

  useEffect(() => {
    if (success) {
      setLoader(false);
      history.goBack();
    }
    if (isSubmitSuccessful) {
      reset({});
    }
    dispatch(updateState())
  }, [success]);

  useEffect(() => {
    if (error) {
      setLoader(false);
      dispatch(updateState())
    }
  }, [error])

  return (
    <>
      {loader ? (<FullPageLoader />) :
        (
          <>
            {/* <div className="col-lg-9 col-md-8"> */}
            <div className="content-wrapper right-content-wrapper">
              <div className="content-box">
                <FontAwesomeIcon className="faArrowLeftIcon" icon={faArrowLeft} onClick={() => history.goBack()} />
                <h3>Add Permission</h3>
                <form onSubmit={handleSubmit(handleSave)}>
                  <div className="form-group col-md-12">
                    <label className="control-label">Permission Name</label>
                    <input type="text" className="form-control" placeholder="Enter Permission name"
                      {...register('name', addPerm.name)} name='name' />
                    {errors?.name && <span className="errMsg">{errors.name.message}</span>}
                  </div>
                  <div>
                    <button className="btn-default btn" type="submit">Save</button>
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

export default AddPermission;
