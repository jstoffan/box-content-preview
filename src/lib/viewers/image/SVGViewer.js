import ImageViewer from './ImageViewer';

export default class SVGViewer extends ImageViewer {
    /**
     * Fetch the SVG XML content and derive its size, if possible
     *
     * @override
     * @param imageEl
     * @returns {Promise}
     */
    setOriginalImageSize(imageEl) {
        return new Promise(resolve => {
            this.api
                .get(imageEl.src, { type: 'text' })
                .then(imageAsText => {
                    let height;
                    let width;

                    try {
                        const parser = new DOMParser();
                        const { documentElement: svgEl } = parser.parseFromString(imageAsText, 'image/svg+xml');
                        const svgHeight = svgEl.getAttribute('height');
                        const svgWidth = svgEl.getAttribute('width');
                        const viewBox = svgEl.getAttribute('viewBox');
                        const [, , viewBoxWidth, viewBoxHeight] = viewBox.split(' ');

                        height = svgHeight && svgWidth ? svgHeight : viewBoxHeight;
                        width = svgHeight && svgWidth ? svgWidth : viewBoxWidth;
                    } catch (e) {
                        // Noop, fall back to defaults
                    }

                    // Fall back to sane defaults if the image is tiny or has no defined dimensions
                    imageEl.setAttribute('originalHeight', height >= 50 ? height : '150');
                    imageEl.setAttribute('originalWidth', width >= 50 ? width : '300');
                })
                .then(resolve)
                .catch(resolve);
        });
    }
}
