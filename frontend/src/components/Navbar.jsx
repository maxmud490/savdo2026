
import "bootstrap/dist/css/bootstrap.min.css";
import burger from "../assets/burger-menu.svg";
import { ToastContainer } from "react-toastify";

const Navbar = ({ handlerShowContent, handleLogout }) => {
  return (
    
    <nav className="navbar navbar-light bg-white shadow fixed-top">

      <div className="container-fluid">
      <ToastContainer />
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex items-center">
          <div style={{ cursor: 'pointer' }}>
              <img
                src={burger}
                alt="burger-menu"
                style={{maxWidth: "70px", maxHeight: "70px"}}
                className="img-fluid px-4"
                onClick={handlerShowContent}
              />
            </div>
            <div className=" mx-3 d-none d-md-block ">
              <button type="button" className="btn btn-orange btn-sm">
                Основной склад
              </button>
            </div>

            <button type="button" className="btn btn-red btn-sm d-none d-md-block">
              O'zbekcha
            </button>
          </div>
          <div className="logo-text">
            <h1 className="text-danger fw-bold " style={{ whiteSpace: "nowrap" }}>Asilbek Gulasal</h1>
          </div>
          <div className="d-flex w-400 justify-center align-middle">
            <div className="mt-1 mr-4 d-none d-md-block"><strong className="text-info fs-5">+998902990052</strong></div>
              <div>
                <button 
                onClick={handleLogout}
              className="btn btn-primary">Chiqish</button></div>
            </div>
          </div>
        </div>
      
    </nav>
  );
};

export default Navbar;


