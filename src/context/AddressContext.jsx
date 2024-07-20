import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContextUser';

export const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const { userInfo } = useContext(AuthContext);
  const [address, setAddress] = useState({});
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    if (userInfo) {
      const storedAddresses = localStorage.getItem(`addresses_${userInfo.userId}`);
      if (storedAddresses) {
        setAddresses(JSON.parse(storedAddresses));
      } else {
        setAddresses([]);
      }
    }
  }, [userInfo]);

  const addAddress = (newAddress) => {
    const updatedAddresses = [...addresses, newAddress];
    setAddresses(updatedAddresses);
    localStorage.setItem(`addresses_${userInfo.userId}`, JSON.stringify(updatedAddresses));
  };

  const editAddress = (index, updatedAddress) => {
    const updatedAddresses = addresses.map((address, i) =>
      i === index ? updatedAddress : address
    );
    setAddresses(updatedAddresses);
    localStorage.setItem(`addresses_${userInfo.userId}`, JSON.stringify(updatedAddresses));
  };

  const deleteAddress = (index) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
    localStorage.setItem(`addresses_${userInfo.userId}`, JSON.stringify(updatedAddresses));
  };

  const updateSelectedAddress = (selectedAddress) => {
    setAddress(selectedAddress);
  };

  return (
    <AddressContext.Provider value={{ address, addresses, addAddress, editAddress, deleteAddress, updateSelectedAddress }}>
      {children}
    </AddressContext.Provider>
  );
};
