// src/components/ModalWrapper.jsx
import Portal from './Portal';

const ModalWrapper = ({ onClose, children }) => {
  return (
    <Portal>
  <div style={{
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    zIndex: 9999,
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  }}>
    <div style={{
      position:'relative',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    // height:'800px'
  }}>
      <button 
        onClick={onClose} 
        style={{
          position:'absolute',
          top:'-25px', right:'13%',
          background: 'transparent',
          border:' 2px solid white',
          color:'white',
          padding:'0px 7px',
          fontSize: '1.2rem',
          borderRadius:'50%',
          cursor: 'pointer',
          zIndex:100000
        }}
      >
        X
      </button>

      {children}
    </div>
  </div>
</Portal>

  );
};

export default ModalWrapper;
