import React, { useState } from 'react';
import { __ } from '@wordpress/i18n';
import {CloudArrowUpIcon} from "@heroicons/react/24/outline";

function DragAndDropComponent() {
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileUpload = (files: FileList | null) => {
        console.log(files, 'files')
        if (files && files.length > 0) {
            setIsLoading(true);

            // Simulating a file upload process
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                setUploadProgress(progress);
                if (progress >= 100) {
                    clearInterval(interval);
                    setIsLoading(false);
                    setUploadProgress(0);
                    // Handle the uploaded file here
                }
            }, 200);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        handleFileUpload(files);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const progressBarStyle = {
        width: `${uploadProgress}%`,
        background: `linear-gradient(to right, #4299e1 ${uploadProgress}%, transparent ${uploadProgress}%)`,
    };

    return (
        <>
            <div className="flex items-center justify-center w-full">
                <div
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <div>
                        <label htmlFor="dropzone-file">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <CloudArrowUpIcon className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" />
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">{__('Click to upload', 'pcm')}</span> {__('or drag and drop file here', 'pcm')}
                                </p>
                                <p className="text-xs text-gray-500">{__('CSV and Excel files only', 'pcm')}</p>
                            </div>
                            <input
                                id="dropzone-file"
                                type="file"
                                className="hidden"
                                onChange={(event) => handleFileUpload(event.target.files)}
                                disabled={isLoading}
                            />
                        </label>
                    </div>
                </div>
            </div>
            {isLoading && (
                <div className="flex flex-col items-center justify-center w-full">
                    <div className="w-full bg-blue-100 h-2 rounded-md">
                        <div style={progressBarStyle} className="h-2 rounded-md" />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">{uploadProgress}% {__('Uploaded', 'pcm')}</p>
                </div>
            )}
        </>
    );
}

export default DragAndDropComponent;
