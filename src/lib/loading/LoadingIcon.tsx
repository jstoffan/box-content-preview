import React from 'react';
import ReactDOM from 'react-dom';
import FileIcon from 'box-ui-elements/es/icons/file-icon';

export type Options = {
    containerEl: HTMLElement;
};

export default class LoadingIcon {
    containerEl: HTMLElement;

    constructor({ containerEl }: Options) {
        this.containerEl = containerEl;
    }

    destroy(): void {
        ReactDOM.unmountComponentAtNode(this.containerEl);
    }

    render(extension: string): void {
        ReactDOM.render(<FileIcon extension={extension} />, this.containerEl);
    }
}
