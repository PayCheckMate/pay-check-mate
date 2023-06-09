import { Link } from "react-router-dom";

interface ButtonProps {
    path?: string;
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
}

export const Button = ({ className, children, onClick, path, type='button' }: ButtonProps) => {
    const buttonClass = className ? `btn-primary ${className}` : 'btn-primary';

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    if (path) {
        return (
            <Link to={path} className={buttonClass}>
                {children}
            </Link>
        );
    }

    return (
        <button type={type} className={buttonClass} onClick={handleClick}>
            {children}
        </button>
    );
};