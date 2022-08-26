import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MultiSelect } from "react-multi-select-component";
import { displayPermissions } from "../../redux/permissions/permissionActions";
import { addRole } from "../../redux/roles/roleActions";
import FullPageLoader from "../FullPageLoader/fullPageLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from 'react-router-dom';

const AddRole = () => {

  const history = useHistory();
  const dispatch = useDispatch();
  const permissions = useSelector((state) => state.permission?.permissions);

  const [role, setRole] = useState("");
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [roleErr, setRoleErr] = useState("");
  const [permissionErr, setPermissionErr] = useState("");
  const [loader, setLoader] = useState(false);
  const success = useSelector(state => state.role?.success);

  const getPermissions = async () => {
    if (permissions) {
      const optionsValue = await permissions.map((permission) => ({
        key: permission._id,
        value: permission._id,
        label: permission.name,
      }));
      setOptions(optionsValue);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const exp = /^[a-z A-Z_]+$/;
    if (!role && selected.length < 1) {
      setRoleErr("Role name is required");
      setPermissionErr("Please Select Permission");
    } else if (!role.match(exp)) {
      setRoleErr("Only Alphabets are allowed");
    } else if (selected.length < 1) {
      setPermissionErr("Please select permission");
    } else {
      setLoader(true);
      let tempIds = [];
      selected.forEach((item) => {
        tempIds.push(item.key);
      });
      const data = {
        name: role,
        permissionIds: tempIds,
      };
      dispatch(addRole(data));
      setRoleErr("");
      setPermissionErr("");
      setRole("");
      setSelected([]);
    }
  };

  useEffect(() => {
    dispatch(displayPermissions());
  }, []);

  useEffect(() => {
    getPermissions();
  }, [permissions]);

  useEffect(() => {
    if (success) {
      setLoader(false);
      history.goBack();
    }
  }, [success])

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
              <h3>Add Role</h3>
              <form>
                <div className="form-group col-md-12">
                  <label className="control-label">Role</label>
                  <input type="text" required="required" className="form-control" name="role" value={role}
                    placeholder="Enter role" onChange={(e) => {
                      if (e.target.value) {
                        setRole(e.target.value)
                        setRoleErr("")
                      } else {
                        setRole(e.target.value)
                        setRoleErr("Role name is required")
                      }
                    }} />
                  {roleErr ? (<span className="errMsg">{roleErr}</span>) : ("")}
                </div>
                <div className="form-group col-md-12 pt-2 custom-milti-select">
                  <label className="control-label">Select Permissions</label>
                  <MultiSelect name="options" options={options} value={selected} onChange={setSelected} labelledBy="Select" />
                  {permissionErr ? (<span className="errMsg">{permissionErr}</span>) : ("")}
                </div>
                <div>
                  <button className="btn btn-default" onClick={handleSubmit}> Save </button>
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

export default AddRole;