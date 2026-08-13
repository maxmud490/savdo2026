
import { useState, useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import PropTypes from 'prop-types';
import { contentList } from '../datalist/contentList';
import { dropListItems } from '../datalist/dropListItems';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';


const Dashboard = ({showContent}) => {
  const [selectedContent, setSelectedContent] = useState(null);
  const [addClass, setAddClass] = useState(false)
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
 
 
  const handleContentSelect = (content) => {
   
    if (content.id === 1) {
      setSelectedContent(null);
      navigate('/');
      setAddClass(true)
    } else {
      setSelectedContent(content === selectedContent ? null : content);
       setAddClass(false)
    }
    
  };
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      // Clicked outside the dropdown, close it
      setSelectedContent(null);
      setAddClass(true)
    }
  };

  useEffect(() => {
    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Empty dependency array to run only once on mount

  const renderDropdownItems = () => {
    if (selectedContent) {
      if (selectedContent.id === 2) {
        return dropListItems.product.map((item) => (
          <ul key={item.id} className='d-block'>
            <li className='list_items'>
            <Link to={`/${item.id}`}>
              <FontAwesomeIcon icon={item.icon} className='item_icon'/>
             <span
             onClick={()=> setSelectedContent(null)}
              className='list_title'> {item.title}</span>
              </Link>
            </li>
          </ul>
        ));
      } else if (selectedContent.id === 3) {
        return dropListItems.base.map((item) => (
          <ul key={item.id} >
            <li className='list_items'>
            <Link to={`/products/${item.id}`}>
              <FontAwesomeIcon icon={item.icon} className='item_icon'/>
             <span 
               onClick={()=> setSelectedContent(null)}
             className='list_title'> {item.title}</span>
              </Link>
            </li>
          </ul>
        ));
     
         } else {
        return null;
      }
    }
    return null;
  };

  return (
    <div className={`sidebar ${!showContent ? 'animate' : ''}`}>
      <div className="content-wrapper">
        {contentList.map((content) => (
          <div
            key={content.id}
            className={`content ${content === selectedContent ? 'selected':''} ${addClass && content.title === "Bosh sahifa" ? "selected": ""}`}
            onClick={() => handleContentSelect(content)}
          >
            <img
              src={content.icon}
              alt="icons"
              width={32}
              height={32}
              className={content === selectedContent ? 'red-icon' : ''}
            />
            <span className="pt-2 text-nowrap">{content.title}</span>
          </div>
        ))}
      </div>
      {selectedContent && (
        <div className={` pt-4 dropdown  ${selectedContent ? 'active' : ''}`} ref={dropdownRef}>
          <div>{renderDropdownItems()}</div>
        </div>
      )}
    </div>
  );
};
Dashboard.propTypes = {
  showContent: PropTypes.bool.isRequired,
};
export default Dashboard;




