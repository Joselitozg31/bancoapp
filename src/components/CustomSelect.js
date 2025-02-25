// components/CustomSelect.js
'use client'; // Asegúrate de que este componente sea del lado del cliente
import { useEffect, useState } from 'react';
import Select from 'react-select';

const CustomSelect = ({ options, value, onChange, placeholder }) => {
  const [isMounted, setIsMounted] = useState(false);

  // Asegúrate de que el componente solo se renderice en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Si no está montado, no renderices nada
  if (!isMounted) {
    return null;
  }

  // Estilos personalizados para react-select
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      borderRadius: '0.5rem',
      boxShadow: 'none',
      minHeight: '3rem',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'rgba(59, 130, 246, 0.8)' // Azul seleccionado
        : state.isFocused
        ? 'rgba(255, 255, 255, 0.1)' // Fondo al hacer hover
        : 'transparent', // Fondo por defecto
      color: state.isSelected ? 'white' : 'white', // Color del texto
      padding: '0.5rem 1rem',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fondo del menú desplegable
      borderRadius: '0.5rem',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'white', // Color del texto seleccionado
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'rgba(255, 255, 255, 0.5)', // Color del placeholder
    }),
  };

  return (
    <Select
      options={options}
      value={options.find((option) => option.value === value)}
      onChange={(selectedOption) => onChange(selectedOption)}
      placeholder={placeholder}
      styles={customStyles}
    />
  );
};

export default CustomSelect;