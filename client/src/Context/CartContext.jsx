import {createContext, useReducer, useContext} from 'react'

const getInitialCart = () => {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  };

const initialState = {
    cartItems:getInitialCart()
}

const cartReducer = (state, action) => {
     switch (action.type) {
    case 'Add_to_cart': {
        const exist = state.cartItems.some(
            (item) => item === action.payload
        )
        if (exist) {
            return state
        }
        
      const updatedCart = [...state.cartItems, action.payload];
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      return { ...state, cartItems: updatedCart };
    }

    case 'Remove_from_cart': {
      const updatedCart = state.cartItems.filter(
        (item) => item.id !== action.payload.id
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      return { ...state, cartItems: updatedCart };
    }

    case 'Clear_cart': {
      localStorage.removeItem('cartItems');
      return { ...state, cartItems: [] };
    }

    default:
      return state;
  }
}

const CartContext = createContext()

export const CartProvider = ({children}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  return(
    <CartContext.Provider value={{state, dispatch}}>
        {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext);
