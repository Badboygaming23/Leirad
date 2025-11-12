import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({ icon, className, ...props }) => (
    <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {icon}
        </div>
        <input
            {...props}
            className={`block w-full rounded-md border-slate-300 bg-slate-50/50 py-3 pl-10 pr-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm read-only:cursor-not-allowed read-only:bg-slate-200/50 ${className}`}
        />
    </div>
);

export default InputField;
