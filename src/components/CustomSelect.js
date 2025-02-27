// components/CustomSelect.js
'use client'; // Asegúrate de que este componente sea del lado del cliente
import { useEffect, useState } from 'react';
import Select from 'react-select';

const CustomSelect = ({ options, value, onChange, placeholder }) => {
  const [isMounted, setIsMounted] = useState(false); // Estado para verificar si el componente está montado

  // Asegúrate de que el componente solo se renderice en el cliente
  useEffect(() => {
    setIsMounted(true); // Establecer isMounted a true cuando el componente se monte
  }, []);

  // Si no está montado, no renderices nada
  if (!isMounted) {
    return null; // No renderizar nada si el componente no está montado
  }

  // Estilos personalizados para react-select
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(255, 255, 255, 0.2)', // Fondo del control
      border: 'none', // Sin borde
      borderRadius: '0.5rem', // Bordes redondeados
      boxShadow: 'none', // Sin sombra
      minHeight: '3rem', // Altura mínima
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'rgba(59, 130, 246, 0.8)' // Azul seleccionado
        : state.isFocused
        ? 'rgba(255, 255, 255, 0.1)' // Fondo al hacer hover
        : 'transparent', // Fondo por defecto
      color: state.isSelected ? 'white' : 'white', // Color del texto
      padding: '0.5rem 1rem', // Relleno
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fondo del menú desplegable
      borderRadius: '0.5rem', // Bordes redondeados
      border: '1px solid rgba(255, 255, 255, 0.2)', // Borde del menú
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
      options={options} // Opciones para el select
      value={options.find((option) => option.value === value)} // Valor seleccionado
      onChange={(selectedOption) => onChange(selectedOption)} // Manejar el cambio de selección
      placeholder={placeholder} // Placeholder del select
      styles={customStyles} // Aplicar estilos personalizados
    />
  );
};

export default CustomSelect;