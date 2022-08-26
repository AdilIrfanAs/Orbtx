import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import ProfileSideBar from '../ProfileSideBar/ProfileSideBar';
import userImage from "../../assets/images/user-image.png";
import { editUser, getUser } from '../../redux/users/userActions';
import FullPageLoader from '../FullPageLoader/fullPageLoader';

const Setting = () => {

  const dispatch = useDispatch();
  const initialUserState = { firstName: "", lastName: "", phone: "" };
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [user, setUser] = useState(initialUserState);
  const [errors, setErrors] = useState("");
  const [loader, setLoader] = useState(true);
  const userData = useSelector(state => state.user?.user);

  useEffect(() => {
    const loginUser = localStorage.getItem('uId');
    const uId = JSON.parse(loginUser)
    dispatch(getUser(uId));
  }, []);

  useEffect(() => {
    setLoader(true)
    setUser(userData);
    if (userData) {
      setLoader(false)
    }
  }, [userData]);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
    setImageName(event.target.files[0].name)
  }

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, phone } = user;
    const exp = /^[a-z A-Z]+$/;
    if (firstName == "") {
      setErrors("Firstname is required!");
    } else if (!firstName?.match(exp)) {
      setErrors("Invalid firstname (Only letters a-z allowed)!");
    } else if (lastName == "") {
      setErrors("Lastname is required!");
    } else if (!lastName?.match(exp)) {
      setErrors("Invalid lastname (Only letters a-z allowed)!");
    } else if (phone == "") {
      setErrors("Phone number is required!");
    } else if (imageName == "placeholder.png") {
      setErrors("Picture is required!")
    } else {
      setErrors("")
      var formData = new FormData();
      formData.append("firstName", user.firstName)
      formData.append("lastName", user.lastName)
      formData.append("phone", user.phone)
      if (image) {
        formData.append("image", image, imageName)
      }
      dispatch(editUser(user._id, formData));
    }
  }

  return (
    <>
      <section className='user-setting'>
        <Row>
          <ProfileSideBar />
          <Col lg={10} className="my-profile-col ">
            <Container fluid >
              {loader ? <FullPageLoader /> :
                <div className="container rounded mt-5 mb-5">
                  <div className="row">
                    <div className="col-md-3 border-right">
                      <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                        <div><img className="rounded-circle mt-5" width={'200px'} height='200px' src={user?.profileImage ? `${process.env.REACT_APP_SERVER_URL}/images/` + user.profileImage : userImage} alt="" fluid /></div>
                        <div className='profile-img-choosen'><input type='file' name="image" accept="image/*" onChange={handleImageChange} /></div>
                        <div style={{ paddingTop: "10px" }}><span className="text-light-50">{user?.username}</span></div>
                      </div>
                    </div>
                    <div className="col-md-9 border-right">
                      <form onSubmit={handleSubmit}>
                        <div className="p-3 py-5">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="text-right text-light">Profile Settings</h4>
                          </div>
                          <div className="row mt-2">
                            <div className="col-md-6">
                              <label className="labels text-light">First Name</label>
                              <input type="text" className="form-control" placeholder="first name" value={user?.firstName}
                                onChange={handleChange} name="firstName" />
                            </div>
                            <div className="col-md-6">
                              <label className="labels text-light">Last Name</label>
                              <input type="text" className="form-control" placeholder="last name" value={user?.lastName}
                                onChange={handleChange} name="lastName" />
                            </div>
                          </div>
                          <div className="row mt-3">
                            <div className="col-md-12">
                              <label className="labels text-light">Username</label>
                              <input type="text" className="form-control" value={user?.username} disabled />
                            </div>
                            <div className="col-md-12 pt-3">
                              <label className="labels text-light">Email</label>
                              <input type="text" className="form-control" value={user?.email} disabled />
                            </div>
                            <div className="col-md-12 pt-3">
                              <label className="labels text-light">PhoneNumber</label>
                              <input type="number" className="form-control" placeholder="enter phone number" value={user?.phone}
                                onChange={handleChange} name="phone" />
                            </div>
                          </div>
                          {errors ? (
                            <div style={{ color: "#FE6E00" }} className="alert alert-danger">
                              {errors}
                            </div>
                          ) : ("")
                          }
                          <div className="mt-5 text-center">
                            <button className="btn form-btn save-profile-btn ms-auto" onClick={handleSubmit}>Save Profile</button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              }
            </Container>
          </Col>
        </Row>
      </section>
    </>
  )
}

export default Setting