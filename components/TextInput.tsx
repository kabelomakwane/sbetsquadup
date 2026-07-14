import type { InputHTMLAttributes, ReactNode } from "react";

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function TextInput({
  leftIcon,
  rightIcon,
  className = "",
  ...props
}: TextInputProps) {
  return (
    <div
      className={`flex w-full items-center gap-3 rounded-pill bg-white p-3 ${className}`}
    >
      {leftIcon}
      <input
        className="font-body min-w-0 flex-1 bg-transparent text-base font-normal not-italic text-black outline-none placeholder:text-black-60"
        {...props}
      />
      {rightIcon}
    </div>
  );
}
