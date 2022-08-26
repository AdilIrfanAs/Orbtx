import React, { useState, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { Container, Image, Navbar } from "react-bootstrap";
import Logo from "../../assets/images/orbtx.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTransgenderAlt,
  faUser,
  faWallet,
  faGear,
  faSignOutAlt,
  faSignIn,
  faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import { ENV } from "../../config/config";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/users/userActions";
import { LogoutUser } from "../../redux/auth/authActions";
import HB from "../../assets/images/header-back.svg";
import EXC from '../../assets/images/exchange-svg-icon.svg';
import TDI from '../../assets/images/trade-svg-icon.svg';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(true);
  let user = {};
  let userkeys = ENV.getUserKeys();
  if (userkeys) {
    user = JSON.parse(userkeys)[0];
  }

  const [masterId, setMasterId] = useState("");
  const [refCount, setRefCount] = useState(0);
  const [path, setPath] = useState("/");

  const token = localStorage.getItem("uToken");

  useEffect(() => {
    const pathname = window.location.pathname;
    console.log(pathname);
    setPath(pathname);
  }, [window.location.pathname]);

  useEffect(() => {
    dispatch(setUser(user));
    setMasterId(user?.users ? user?.users._id : "");
    setRefCount(user ? user?.refCount : 0);
  }, []);

  const logOut = (e) => {
    e.preventDefault();
    dispatch(LogoutUser());
    localStorage.removeItem("uToken");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("uId");
    navigate("/");
  };

  return (
    <>
      <div className="header header-js">
        {path == '/additional-security' || path == '/assets' || path == '/connect-device' || path == '/personalize' || path == '/backup' ?
          <>
            {/* ====================== header 2 ====================== */}

            <Navbar
              className="navbar navbar-expand-lg navbar-light pb-0 header2"
              expand="lg"
            >
              <Container fluid>
                <NavLink className="nav-link ps-0" to="/portfolio">
                  <Image src={HB} fluid className="header-back-btn" />
                </NavLink>
                <Link className="m-0 navbar-brand navbar-brand2" to="/">
                  <Image src={Logo} fluid />
                </Link>
                <Navbar.Collapse
                  className="header-navbar-collapse-icon"
                  id="basic-navbar-nav"
                >
                  <nav className="navbar-nav">
                    <NavLink className="nav-link" to="/additional-security">
                      Security
                    </NavLink>
                  </nav>
                </Navbar.Collapse>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <nav
                  className="header-navbar-collapse-icon header-navbar-collapse-icon2 navbar-nav header-right-icons"
                  style={{ flexDirection: "row" }}
                >
                  <NavLink className="nav-link header-transactions-navlink" to="/transactions">
                    <FontAwesomeIcon
                      icon={faTransgenderAlt}
                      className="header-icon"
                    />
                    <span className="navbar-tooltip bg-color">History</span>
                  </NavLink>
                  <NavLink className="nav-link" to="/additional-security">
                    <FontAwesomeIcon
                      icon={faGear}
                      className="header-icon"
                    />
                    <span className="navbar-tooltip bg-color">Settings</span>
                  </NavLink>
                  <NavLink className="nav-link" to="/logout" onClick={(e) => logOut(e)}> <FontAwesomeIcon icon={faSignOutAlt} className="header-icon" /><span className="navbar-tooltip bg-color">Logout</span></NavLink>
                </nav>
              </Container>
            </Navbar>
          </>
          :
          <>
            {/* ======================= header 1 ======================== */}
            <Navbar className="navbar navbar-expand-lg navbar-light header1 pb-0" expand="lg">
              <Container fluid>
                <Link className="m-0 navbar-brand" to="/"><Image src={Logo} fluid /></Link>
                <Navbar.Collapse className="header-navbar-collapse-icon" id="basic-navbar-nav">
                  <nav className="navbar-nav">
                    <NavLink className="nav-link header-portfolio-navlink" to="/portfolio"><FontAwesomeIcon icon={faUser} className="header-icon" /><span className="navbar-tooltip mobile-none">Portfolio</span><span className="navbar-link-heading mobile-none2">Portfolio</span></NavLink>
                    <NavLink className="nav-link header-activity-navlink" to="/activity/ETH"><FontAwesomeIcon icon={faWallet} className="header-icon" /><span className="navbar-tooltip mobile-none">Wallet</span><span className="navbar-link-heading mobile-none2">Wallet</span></NavLink>
                    <NavLink className="nav-link header-exchange-navlink" to="/exchange/ETH"><img src={EXC} className='img-fluid' alt='' /><span className="navbar-tooltip mobile-none">Exchange</span><span className="navbar-link-heading mobile-none2">Exchange</span></NavLink>
                    {/* desktop dropdown */}
                    <Navbar className={path.includes('/trade/') || path.includes('/trade-spot/') ? 'nav-link dropdown-hover header-trade-dd mobile-none active' : 'nav-link header-trade-dd dropdown-hover mobile-none'}>
                      <button className="dropbtn-hover p-0"><img src={TDI} className="header-icon header-trade-icon" alt="" /></button>
                      <div className="dropdown-content-hover">
                        <Link to="/trade/ETHUSDT" className={path.includes('/trade/') ? "active nav-link" : "nav-link"} >Futures Trading</Link>
                        <Link to="/trade-spot/ETHUSDT" className={path.includes('/trade-spot/') ? "active nav-link" : "nav-link"}>Spot Trading</Link>
                      </div>
                    </Navbar>
                    {/* mobile dropdown */}
                    <div className="dropdown header-trade-dd-mobile navbar-nav nav-link mobile-none2">
                      <button className="btn text-white dropdown-toggle p-0" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src={TDI} className="header-icon header-trade-icon" alt="" />
                        <span className="navbar-link-heading mobile-none2" style={{ fontWeight: 700 }}>Trade</span>
                      </button>
                      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li><Link to="/trade/ETHUSDT" className={path.includes('/trade/') ? "active nav-link" : "nav-link"} >Futures Trading</Link></li>
                        <li><Link to="/trade-spot/ETHUSDT" className={path.includes('/trade-spot/') ? "active nav-link" : "nav-link"}>Spot Trading</Link></li>
                      </ul>
                    </div>
                  </nav>
                </Navbar.Collapse>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                {token ?
                  <nav className="header-navbar-collapse-icon navbar-nav header-right-icons" style={{ flexDirection: "row" }}>
                    <NavLink className="nav-link header-transactions-navlink" to="/transactions"><FontAwesomeIcon icon={faTransgenderAlt} className="header-icon" /><span className="navbar-tooltip bg-color">History</span></NavLink>
                    <NavLink className="nav-link" to="/additional-security"> <FontAwesomeIcon icon={faGear} className="header-icon" /><span className="navbar-tooltip bg-color">Settings</span></NavLink>
                    <NavLink className="nav-link" to="/logout" onClick={(e) => logOut(e)}> <FontAwesomeIcon icon={faSignOutAlt} className="header-icon" /><span className="navbar-tooltip bg-color">Logout</span></NavLink>
                  </nav>
                  :
                  <nav className="header-navbar-collapse-icon navbar-nav header-right-icons" style={{ flexDirection: "row" }}>
                    <NavLink className="nav-link header-transactions-navlink" to="/register"><FontAwesomeIcon icon={faUserPlus} className="header-icon" /><span className="navbar-tooltip bg-color">Signup</span></NavLink>
                    <NavLink className="nav-link" to="/login"> <FontAwesomeIcon icon={faSignIn} className="header-icon" /><span className="navbar-tooltip bg-color">SignIn</span></NavLink>
                  </nav>
                }
              </Container>
            </Navbar>
          </>
        }
      </div>
    </>
  );
};

export default Header;
