import ControlsRoot, { Options } from '../controls/controls-root';
import './VideoControlsRoot.scss';

export default class VideoControlsRoot extends ControlsRoot {
    constructor(options: Options) {
        super(options);

        this.controlsEl.setAttribute('class', 'bp-VideoControlsRoot');
    }
}
