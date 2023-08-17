import {useEffect, useState} from "@wordpress/element";
import {NotFound} from "../404";
import ProgressiveImg from "./ProgressiveImg";

export const NeedPro = () => {
    const [jsonData, setJsonData] = useState({} as any);
    const [pageId, setPageId] = useState('')
    const currentURL = window.location.href;
    useEffect(() => {
        const urlSegments = currentURL.split('/');
        const idIndex = urlSegments.indexOf('pro');
        if (idIndex !== -1 && idIndex < urlSegments.length - 1) {
            setPageId(urlSegments[idIndex + 1])
        }

        fetch("https://raw.githubusercontent.com/PayCheckMate/pay-check-mate-utility/develop/need_pro.json"
            // @ts-ignore
        ).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.need_pro[`pro/${pageId}`] !== undefined) {
                    setJsonData(responseJson.need_pro[`pro/${pageId}`].image_urls);
                } else {
                    setJsonData({})
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, [pageId, currentURL])

    return (
        <>
            <div>
                {Object.keys(jsonData).length > 0 ? Object.keys(jsonData).map((index: string) => {
                    return (
                        <div key={index} className="px-4 py-5">
                            <h1 className="text-base font-semibold leading-6 text-gray-900 mb-6">
                                {index}
                            </h1>
                            <ProgressiveImg
                                src={jsonData[index]}
                                placeholderSrc={jsonData[index]}
                                alt={index}
                            />
                        </div>
                    )
                }): <NotFound/>}
            </div>
        </>
    );

}
