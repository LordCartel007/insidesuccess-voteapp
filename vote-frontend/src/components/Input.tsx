import React, { FC, InputHTMLAttributes } from "react";

// Define the props interface
// Added interface InputProps that extends InputHTMLAttributes<HTMLInputElement> to get all standard <input /> props
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: React.ComponentType<{ className?: string }>;
}

//renaming icon to Icon since it is a react component
//reusing the same input component for login and signup
const Input: FC<InputProps> = ({ icon: Icon, ...props }) => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size-5 text-green-500" />
      </div>
      <input
        {...props}
        className="w-full pl-10 pr-3 py-2
    bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700
    focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white
    placeholder-gray-400 transition duration-200"
      />
    </div>
  );
};

export default Input;
