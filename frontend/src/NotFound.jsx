import { Link } from 'react-router-dom';
import './App.css'
function NotFound() {
    return (
      <div style={{position: 'absolute', top: '40%', left: '40%',transformTranslate: '50% 50%'}}>
         <h1 className='fs-4 text-center'>Not Found!</h1>  
         <p>Kechirasiz, siz qidirayotgan sahifa mavjud emas.</p>  
         <Link className="return-home-btn ml-5" to="/">Bosh sahifaga qaytish!</Link>        
      </div>
    )
  }
  
  export default NotFound;