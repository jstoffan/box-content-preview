import React from 'react';
import IconArrowDown24 from '../icons/IconArrowDown24';
import IconArrowUp24 from '../icons/IconArrowUp24';
import PageControlsForm from './PageControlsForm';
import './PageControls.scss';

export type Props = {
    onPageChange: (newPageNumber: number) => void;
    pageCount: number;
    pageNumber: number;
};

export default function PageControls({ onPageChange, pageCount, pageNumber }: Props): JSX.Element {
    const nextPageButtonRef = React.useRef<HTMLButtonElement | null>(null);

    return (
        <div className="bp-PageControls">
            <button
                className="bp-PageControls-button"
                data-testid="bp-PageControls-previous"
                disabled={pageNumber === 1}
                onClick={(): void => onPageChange(pageNumber - 1)}
                title={__('previous_page')}
                type="button"
            >
                <IconArrowUp24 />
            </button>
            <PageControlsForm
                ref={nextPageButtonRef}
                onPageChange={onPageChange}
                pageCount={pageCount}
                pageNumber={pageNumber}
            />
            <button
                ref={nextPageButtonRef}
                className="bp-PageControls-button"
                data-testid="bp-PageControls-next"
                disabled={pageNumber === pageCount}
                onClick={(): void => onPageChange(pageNumber + 1)}
                title={__('next_page')}
                type="button"
            >
                <IconArrowDown24 />
            </button>
        </div>
    );
}
