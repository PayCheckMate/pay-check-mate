import {Link} from "react-router-dom";

interface ButtonProps {
    path?: string;
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
}

export const Button = ({ path, className, children, onClick }: ButtonProps) => {
    const buttonClass = className
        ? `btn-primary ${className}`
        : 'btn-primary';

    return (
        <>
            {path ? (
                <Link to={path} className={buttonClass}>
                    {children}
                </Link>
            ) : (
                <button type="button" className={buttonClass} onClick={onClick}>
                    {children}
                </button>
            )}
        </>
    );
};