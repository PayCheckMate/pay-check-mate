import {useEffect, useState} from "@wordpress/element";
import TableSkeleton from "../TableSkeleton";

interface ProgressiveImgProps {
    placeholderSrc: string;
    src: string;
    alt: string;
}

const ProgressiveImg = ({ placeholderSrc, src, ...props }: ProgressiveImgProps) => {
    const [imgSrc, setImgSrc] = useState(placeholderSrc || src);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            setImgSrc(src);
            setLoading(false);
        };
    }, [src]);

    return (
        loading ? <TableSkeleton rows={10} columns={4} /> :
            <img
                {...{ src: imgSrc, ...props }}
                alt={props.alt || ""}
                loading="lazy"
                className="object-cover w-full"
            />
    );
};

export default ProgressiveImg;
