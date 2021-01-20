import React, { useState } from 'react'
import Select from 'react-select'



const customStyles = {
    control: (base, state) => ({
        ...base,
        width: '30vw',
        background: "#023950",
        borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
        borderColor: 'transparent',
        boxShadow: state.isFocused ? null : null,
        "&:hover": {
            backgroundColor: state.isFocused ? "#022244" : "#023950",
        }
    }),
    menu: (base, state) => ({
        ...base,
        background: "#023950",
        borderRadius: 0,
        marginTop: 0,

    }),
    menuList: (base, state) => ({
        ...base,
        padding: 0,
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#eeeeee'
    }),
    option: (provided, state) => ({
        ...provided,
        color: '#eeeeee',
        "&:hover": {
            backgroundColor: state.isFocused ? "#022244" : "#023950",
        }

    }),
};

function CodeSelect({ options, onChange }) {
    return <div>
        <Select styles={customStyles} options={options} onChange={onChange} ></Select>
    </div>
}
export default CodeSelect;