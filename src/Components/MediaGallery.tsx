import React from '@wordpress/element';
import {__} from "@wordpress/i18n";

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

    const openMediaGallery = (e: any) => {
        e.preventDefault();

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
            <button key={title} id={title} onClick={(e) => openMediaGallery(e)}>
                {__('Open Media Gallery', 'pay-check-mate')}
            </button>
        </div>
    );
};

export default MediaGallery;
