import {PrinterIcon} from "@heroicons/react/24/outline";
import React from "react";

export const PrintButton = ({onClick}: {onClick: () => void}) => {
    return(
        <>
            <PrinterIcon
                className="h-6 w-6 text-gray-500 cursor-pointer"
                onClick={() => onClick()}
            />
        </>
    )
}

// @ts-ignore
window.PrintButton = PrintButton;
