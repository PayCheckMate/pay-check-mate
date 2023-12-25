import React from '@wordpress/element';
import {__} from "@wordpress/i18n";
import {Button} from "./Button";

export type MediaGalleryProps = {
    title: string;
    settingsData: any;
    setSettingsData?: any;
    // Additional props specific to MediaGallery component
}
const MediaGallery = ({title, settingsData, setSettingsData}: MediaGalleryProps) => {
    // @ts-ignore
    const WP = window.wp;
    let mediaFrame: any = null;

    const openMediaGallery = () => {
        if (WP && WP.media) {
            if (mediaFrame) {
                mediaFrame.open();
                return;
            }

            mediaFrame = WP.media({
                title: title || __('Select or Upload Media', 'pay-check-mate'),
                multiple: false,
                button: {
                    text: __('Select', 'pay-check-mate'),
                    close: true,
                },
            });

            mediaFrame.on('select', () => {
                const attachment = mediaFrame.state().get('selection').first().toJSON();
                if (setSettingsData) {
                    setSettingsData({...settingsData, company_logo: attachment.url});
                }
            });

            mediaFrame.open();
        } else {
            console.error('WP.media is not available. Please enqueue wp-media in your plugin.');
        }
    };

    return (
        <div key={`div-${title}`} className="flex items-center">
            <Button className="button-secondary" key={title} id={title} onClick={() => openMediaGallery()}>
                {__('Open Media Gallery', 'pay-check-mate')}
            </Button>
        </div>
    );
};

export default MediaGallery;
