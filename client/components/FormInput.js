import React, { forwardRef } from 'react';

const FormInput = forwardRef(({ icon: Icon, type, name, id, placeholder, errors, value, handleChangeForm, ...rest }, ref) => {
    return (
        <>
            <div className='bg-gray-100 p-2 flex items-center mb-2'>
                <Icon className='text-gray-400 m-2 h-6 w-6' />
                <input
                    type={type}
                    name={name}
                    id={id}
                    placeholder={placeholder}
                    className='bg-gray-100 outline-none text-sm flex-1'
                    value={value}
                    onInput={handleChangeForm}
                    ref={ref} // Forward the ref to the input element
                    {...rest}
                />
            </div>
            {errors && <p className='font-normal text-xs m-0 mb-3 text-left text-red-600'>{errors.message}</p>}
        </>
    );
});

export default FormInput;
