import * as React from 'react';
import arrow from '../assets/arrow.svg';

const useClickOutside = (ref, callback) => {
  const handleClick = e => {
    if (ref.current && !ref.current.contains(e.target) && !ref.current.parentNode.contains(e.target)) {
      callback();
    }
  };
  React.useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
};

const FilterSecondarySidebar = ({open, width, children, title, onClose }) => {
  const clickRef = React.useRef();
  useClickOutside(clickRef, () => {open && onClose()});

  const left = open ? `${width}px` : '0px'
  return (
    <React.Fragment>
      <div
        ref={clickRef}
        className="secondary-sidebar"
        style={{
          left: left,
          //transform: `translatex(${xPosition}px)`,
          width: `${width}px`,
        }}
      >
        <div className="secondary-sidebar-header">
          <div className="arrow-icon reverse" 
            style={{ backgroundImage: `url(${arrow})` }}
            onClick={() => onClose()}
            ></div>
          <div className="filter-title">
            {title}
          </div>
        </div>
        <div className="secondary-sidebar-content">{children}</div>
      </div>
    </React.Fragment>
  )
}

export default FilterSecondarySidebar