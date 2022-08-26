import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MultiSelect } from "react-multi-select-component";
import { getRole, editRole } from '../../redux/roles/roleActions';
import { useParams, useHistory } from 'react-router-dom';
import FullPageLoader from '../FullPageLoader/fullPageLoader';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const EditRole = () => {

   let { id } = useParams();
   const [loader, setLoader] = useState(false);
   const dispatch = useDispatch();
   const roleData = useSelector(state => state.role.editRole);
   const allPermissions = useSelector(state => state.role.allPermissions);
   const [role, setRole] = useState("");
   const [options, setOptions] = useState([]);
   const [selectedItems, setSelected] = useState([]);
   const [roleErr, setRoleErr] = useState("");
   const [permissionErr, setPermissionErr] = useState("");
   const history = useHistory();
   // let tempPermission = [];

   useEffect(() => {
      dispatch(getRole(id));
   }, []);

   useEffect(() => {
      if (roleData && roleData.length > 0 && roleData[0].permissions && roleData[0].permissions.length > 0) {
         let tempRoles = []

         roleData[0].permissions.forEach(item => {

            tempRoles.push({
               "value": item._id,
               "label": item.name,
            })
         })

         setSelected(tempRoles)
      }
   }, [roleData]);

   const getRoleData = async () => {
      let roleName = roleData[0]?.name;
      setRole(roleName);

      const optionsValue = allPermissions.map((permission) => ({
         "value": permission._id,
         "label": permission.name
      }));
      setOptions(optionsValue);
   }

   useEffect(() => {
      getRoleData();
   }, [roleData]);

   const handleSubmit = (e) => {
      e.preventDefault();
      const exp = /^[a-z A-Z_]+$/;
      if (!role && selectedItems.length < 1) {
         setRoleErr("Role name is required");
         setPermissionErr("Please Select Permission");
      } else if (!role.match(exp)) {
         setRoleErr("Only Alphabets are allowed");
      } else if (selectedItems.length < 1) {
         setPermissionErr("Please Select Permission");
      } else {
         setLoader(true);
         let tempIds = [];
         selectedItems.forEach(item => {
            tempIds.push(item.value)
         });
         const data = {
            name: role,
            permissionIds: tempIds,
            id: id
         }
         dispatch(editRole(data));
         setRole("");
         setRoleErr("");
         setPermissionErr("");
         history.goBack();
      }
   }

   return (
      <>
         {loader ? <FullPageLoader /> :
           <>
                {/* <div className="col-lg-9 col-md-8"> */}
               <div className="content-wrapper right-content-wrapper">
                  <div className="content-box">
                     <FontAwesomeIcon className="faArrowLeftIcon" icon={faArrowLeft} onClick={() => history.goBack()} />
                     <h3>Edit Role</h3>
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
                        <div className="form-group col-md-12">
                           <div className="form-group col-md-12 custom-milti-select">
                              <label className="control-label">Select Permissions</label>
                              <MultiSelect options={options} value={selectedItems} onChange={setSelected} labelledBy="Select" />
                              {permissionErr ? (<span className="errMsg">{permissionErr}</span>) : ("")}
                           </div>
                        </div>
                        <div>
                           <button type='button' className="btn-default btn" onClick={(e) => { handleSubmit(e) }}>Save</button>
                        </div>
                     </form>
                  </div>
               </div>
            {/* </div> */}
           </>
         }
      </>
   )
}

export default EditRole