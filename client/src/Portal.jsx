// components/Portal.jsx
import ReactDOM from 'react-dom';

const Portal = ({ children }) => {
    const portalRoot = document.getElementById('portal-root');

    if (!portalRoot) {
      console.error('No portal-root found!');
      return null;
    }
  
    return ReactDOM.createPortal(children, portalRoot);
};

export default Portal;
