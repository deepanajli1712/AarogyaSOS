import React, { useId } from 'react'

const Input = React.forwardRef(function Input({
    label,
    type = "text",
    className = "",
    ...props
}, ref) {
    const id = useId();
    
    return (
        <div className='w-full'>
            {label && (
                <label 
                    className='block text-sm font-medium text-gray-800 mb-2' 
                    htmlFor={id}
                >
                    {label}
                </label>
            )}
            <input
                type={type}
                className={`px-4 py-3 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 duration-300 transition-all border border-gray-300 w-full ${className}`}
                ref={ref}
                {...props}
                id={id}
            />
        </div>
    );
})

export default Input;
