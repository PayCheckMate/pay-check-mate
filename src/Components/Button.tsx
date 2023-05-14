import {Link} from "react-router-dom";

interface ButtonProps {
    path?: string;
    className?: string;
    children: React.ReactNode;
}

export const Button = ({ path, className, children }: ButtonProps) => {
    const buttonClass = className
        ? `${className}`
        : 'btn-primary';

    return (
        <>
            {path ? (
                <Link to={path} className={buttonClass}>
                    {children}
                </Link>
            ) : (
                <button type="button" className={buttonClass}>
                    {children}
                </button>
            )}
        </>
    );
};