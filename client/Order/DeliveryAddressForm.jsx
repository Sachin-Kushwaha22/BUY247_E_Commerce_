import React, { useEffect, useState } from 'react';
import './DeliveryAddressForm.css';
import axios from 'axios';
import serverUrl from '../config';

const DeliveryAddressForm = ({handleCheckoutStep, orderid }) => {
  const [orderId, setOrderId] = useState('')
  useEffect(() => {
    setOrderId(orderid)
  }, [orderid])

  useEffect(() => {
    handleGetSavedAddress()
  },[])
  const statesAndUTsOfIndia = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  const [addressType, setAddressType] = useState(sessionStorage.getItem('addressType') || 'home');
  const [addOpt, setAddOpt] = useState(sessionStorage.getItem('addOpt') || 'newAddress')
  const [addressData, setAddressData] = useState({
    user_name: "",
    phone_number: "",
    pincode: "",
    locality: "",
    street: "",
    district: "",
    state: "",
    landmark: "",
    alternate_phone_number: "",
    type: ""
  })
  const [savedAddress, setSavedAddress] = useState('')
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData({ ...addressData, [name]: value });
  };
  console.log(addressData);


  const handleGetCurrentAddress = () => {
    if (navigator.geolocation) {
      // Get the user's current position
      navigator.geolocation.getCurrentPosition(
        function (position) {
          // Get latitude and longitude
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          console.log("Latitude: " + latitude);
          console.log("Longitude: " + longitude);

          // Now you can pass these coordinates to the Nominatim API to get the address
          getCurrentAddress(latitude, longitude);
        },
        function (error) {
          console.error("Error getting geolocation: ", error);
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }

    const getCurrentAddress = async (lat, lon) => {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`)
        .then(response => response.json())
        .then(data => {
          // Log the address in the console
          console.log(data);  // This gives a human-readable address

          // Autofill the inputs with the data retrieved
          if (data && data.address) {
            document.getElementById('locality').value = data.address.railway || '';
            document.getElementById('pincode').value = data.address.postcode || '';
            document.getElementById('street').value = data.address.road + data.address?.village || data?.display_name || ''; // Autofill the street address
            document.getElementById('city').value = data.address?.city || data.address?.town || data.address?.county || ''; // Autofill city or town
            document.getElementById('state').value = data.address.state || ''; // Autofill state
            document.getElementById('country').value = data.address.country || ''; // Autofill country
          } else {
            alert("Unable to fetch complete address details.");
          }
        })
        .catch(error => console.error('Error fetching the address:', error));
    }

  }

  const handleGetSavedAddress = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/address/get`, {
        withCredentials: true
      })
      if (response.status === 200) {
        setSavedAddress(response.data.address)
        console.log(savedAddress);
      }
    } catch (error) {
      setAddOpt('newAddress')
      sessionStorage.removeItem('addOpt')
      console.log(error);
    }
  }


  const handleSaveAndDeliverBtn = async () => {
    if (addressData.user_name === "" || addressData.phone_number === "" || addressData.pincode === "" || addressData.locality === "" || addressData.street === "" || addressData.district === "" || addressData.state === "" || addressData.type === "") {
      window.alert("Missing Address Field")
      return
    } else {

      try {
        const response = await axios.post(`${serverUrl}/api/address/set`, {
          user_name: addressData.user_name,
          phone_number: addressData.phone_number,
          pincode: addressData.pincode,
          locality: addressData.locality,
          street: addressData.street,
          district: addressData.district,
          state: addressData.state,
          landmark: addressData?.landmark || '',
          alternate_phone_number: addressData?.alternate_phone_number || '',
          type: addressData.type
        }, {
          withCredentials: true
        })

        if (response.status === 200) {
          try {
            const setShippingAddress = await axios.post(`${serverUrl}/api/address/setShippingAddress`, {
              orderid: orderId,
              addressid: response.data?.address?.id,
              addressText: addressData.user_name + " " + addressData.pincode + " " + addressData.locality + " " + addressData?.landmark + " " + addressData.street + " " + addressData.district + " " + addressData.state + " " + addressData.phone_number + " " + addressData?.alternate_phone_number + " " + addressData.type
            }, {
              withCredentials: true
            })
            if (setShippingAddress.status === 200) {
              handleCheckoutStep('overview')
            }
          } catch (error) {
            console.log(error);
          }
        }

      } catch (error) {
        if (error.response) {
          // Handle known errors based on the error message from the backend
          if (error.response.status === 400) {
            const errorMessage = error.response.data.message; // e.g., "You can only have one 'home' address."
            console.log(errorMessage);
            alert(errorMessage);  // Show an alert or display the error message in the UI
          } else {
            // Handle unexpected errors
            console.log('Unexpected error:', error.response.data.message);
            alert('Something went wrong while adding the address. Please try again.');
          }
        } else if (error.request) {
          // If no response was received from the backend
          console.log('No response from server:', error.request);
          alert('Server not reachable. Please try again later.');
        } else {
          // Handle other types of errors (e.g., network issues, etc.)
          console.log('Error:', error.message);
          alert('An error occurred. Please try again.');
        }
      } finally {
        setAddressData({
          user_name: "",
          phone_number: "",
          pincode: "",
          locality: "",
          street: "",
          district: "",
          state: "",
          landmark: "",
          alternate_phone_number: "",
          type: ""
        })
      }
    }
  }



  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
  };


  // Handle form submission or button click
  const handleSubmit = async() => {
    const selectedAddress = savedAddress.find(
      (address) => address.id === selectedAddressId
    );

    try {
      const response = await axios.post(`${serverUrl}/api/address/setShippingAddressForOrder`,{
        orderid: orderId,
        addressText: selectedAddress.user_name + " " + selectedAddress.pincode + " " + selectedAddress.locality + " " + selectedAddress?.landmark + " " + selectedAddress.street + " " + selectedAddress.district + " " + selectedAddress.state + " " + selectedAddress.phone_number + " " + selectedAddress?.alternate_phone_number + " " + selectedAddress.type
      },{
        withCredentials:true
      })
      if(response.status === 200){
        handleCheckoutStep('overview')
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="da-container">

      <div className="da-option">
        <button onClick={() => {
          sessionStorage.setItem('addOpt', 'newAddress')
          setAddOpt('newAddress')
        }} className={`da-option-btn ${addOpt === 'newAddress' ? 'da-option-btn-selected' : ''}`}>Add new address</button>
        <button onClick={() => {
          handleGetSavedAddress()
          sessionStorage.setItem('addOpt', 'savedAddress')
          setAddOpt('savedAddress')
        }} className={`da-option-btn ${addOpt === 'savedAddress' ? 'da-option-btn-selected' : ''}`}>Choose saved address</button>
      </div>
      {addOpt === 'newAddress' && <div className="da-form">

        <button onClick={handleGetCurrentAddress} className="da-location-btn">
          <span className="da-location-icon"><i className="fa-solid fa-location-crosshairs"></i></span>
          Use my current location
        </button>

        <div className="da-form-row">
          <div className="da-form-group da-half">
            <input
              required
              type="text"
              className="da-input"
              name="user_name"
              placeholder="Name"
              autoComplete="name" // To support autofill for name
              value={addressData.user_name}
              onChange={handleAddressChange}
            />
          </div>
          <div className="da-form-group da-half">
            <input
              required
              type="tel"
              className="da-input"
              name="phone_number"
              placeholder="10-digit mobile number"
              autoComplete="tel" // To support autofill for phone number
              value={addressData.phone_number}
              onChange={handleAddressChange}
            />
          </div>
        </div>

        <div className="da-form-row">
          <div className="da-form-group da-half">
            <input
              required
              id='pincode'
              type="text"
              className="da-input"
              name="pincode"
              placeholder="Pincode"
              autoComplete="postal-code" // To support autofill for pincode
              value={addressData.pincode}
              onChange={handleAddressChange}
            />
          </div>
          <div className="da-form-group da-half">
            <input
              required
              id='locality'
              type="text"
              className="da-input"
              name="locality"
              placeholder="Locality"
              autoComplete="address-line2" // Not an official standard, but helps with autofill
              value={addressData.locality}
              onChange={handleAddressChange}
            />
          </div>
        </div>

        <div className="da-form-row">
          <div className="da-form-group">
            <textarea
              id='street'
              className="da-input da-textarea"
              name="street"
              placeholder="Address (Area and Street)"
              autoComplete="street-address" // To support autofill for street address
              value={addressData.street}
              onChange={handleAddressChange}
            ></textarea>
          </div>
        </div>

        <div className="da-form-row">
          <div className="da-form-group da-half">
            <input
              required
              id='city'
              type="text"
              className="da-input"
              name="district"
              placeholder="City/District/Town"
              autoComplete="address-level2" // To support autofill for city/district/town
              value={addressData.district}
              onChange={handleAddressChange}
            />
          </div>
          <div className="da-form-group da-half">
            <select
              required
              id='state'
              className="da-input da-select"
              name="state"
              value={addressData.state}
              onChange={handleAddressChange}
              autoComplete="address-level1" // To support autofill for state
            >
              <option value="">--Select State--</option>
              {statesAndUTsOfIndia.map((place) => (
                <option key={place} value={place}>
                  {place}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="da-form-row">
          <div className="da-form-group da-half">
            <input
              type="text"
              className="da-input"
              name="landmark"
              placeholder="Landmark (Optional)"
              autoComplete="off" // Optional field
              value={addressData.landmark}
              onChange={handleAddressChange}
            />
          </div>
          <div className="da-form-group da-half">
            <input
              type="tel"
              className="da-input"
              name="alternate_phone_number"
              placeholder="Alternate Phone (Optional)"
              autoComplete="tel" // Autofill for alternate phone
              value={addressData.alternate_phone_number}
              onChange={handleAddressChange}
            />
          </div>
        </div>

        <div className="da-form-row">
          <p className="da-type-label">Address Type</p>
          <div className="da-type-options">
            <div className="da-radio-group">
              <input
                type="radio"
                id="homeType"
                name="type" // Correct name matching state
                value="home"
                checked={addressData.type === "home"}
                onChange={handleAddressChange}
              />
              <label htmlFor="homeType">Home</label>
            </div>

            <div className="da-radio-group">
              <input
                type="radio"
                id="workType"
                name="type" // Correct name matching state
                value="work"
                checked={addressData.type === "work"}
                onChange={handleAddressChange}
              />
              <label htmlFor="workType">Work</label>
            </div>

            <div className="da-radio-group">
              <input
                type="radio"
                id="otherType"
                name="type" // Correct name matching state
                value="other"
                checked={addressData.type === "other"}
                onChange={handleAddressChange}
              />
              <label htmlFor="otherType">Other</label>
            </div>
          </div>
        </div>



        <div className="da-form-row">
          <button onClick={handleSaveAndDeliverBtn} className="da-submit-btn">SAVE AND DELIVER HERE</button>
        </div>
      </div>}

      {addOpt === 'savedAddress' && <div>
        <div className='choose-saved-add-div'>
          <form>
            {savedAddress && savedAddress.map((address) => (
              <div
                key={address.id}
                onClick={() => handleSelectAddress(address.id)}
                className={`da-address-wrapper ${selectedAddressId === address.id ? 'selected' : ''}`}
              >
                <label htmlFor={address.id} className="da-address-label">
                  <div className="da-address-type">{address.type.toUpperCase()}</div>
                  <div className="da-address-name">{address.user_name}</div>
                  <div className="da-address-phone">{address.phone_number}</div>
                  {address.alternate_phone_number && (
                    <div className="da-address-phone">{address.alternate_phone_number}</div>
                  )}
                  {address.landmark && (
                    <div className="da-address-location">{address.landmark}</div>
                  )}
                  <div className="da-address-location">
                    {address.street}, {address.locality}, {address.district}, {address.state}
                  </div>
                  <div className="da-address-pincode">Pincode: {address.pincode}</div>
                </label>
              </div>
            ))}
          </form>

          <button className='deliver-here-btn' onClick={handleSubmit}>Deliver Here</button>
        </div>

      </div>}
    </div>
  );
};

export default DeliveryAddressForm;