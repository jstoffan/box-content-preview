import React from 'react';
import { decodeKeydown } from '../../../util';
import './PageControlsForm.scss';

export type Props = {
    onPageSubmit: (page: number) => void;
    pageCount?: number;
    pageNumber?: number;
};

export default function PageControlsForm({ onPageSubmit, pageNumber = 1, pageCount = 1 }: Props): JSX.Element {
    const [inputValue, setInputValue] = React.useState(pageNumber);
    const [isInputShown, setIsInputShown] = React.useState(false);
    const buttonElRef = React.useRef<HTMLButtonElement>(null);
    const inputElRef = React.useRef<HTMLInputElement>(null);
    const isRetryRef = React.useRef(false);

    const setPage = (allowRetry = false): void => {
        if (!Number.isNaN(inputValue) && inputValue >= 1 && inputValue <= pageCount && inputValue !== pageNumber) {
            onPageSubmit(inputValue);
        } else {
            isRetryRef.current = allowRetry; // Move the focus to the button to allow immediate retry
            setInputValue(pageNumber); // Reset the invalid input value to the current page
        }

        setIsInputShown(false);
    };

    const handleNumInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setInputValue(parseInt(event.target.value, 10));
    };

    const handleNumInputBlur = (): void => {
        setPage();
    };

    const handleNumInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        const key = decodeKeydown(event);

        switch (key) {
            case 'Enter':
                event.stopPropagation();
                event.preventDefault();

                setPage(true);
                break;

            case 'Escape':
                event.stopPropagation();
                event.preventDefault();

                isRetryRef.current = true;
                setInputValue(pageNumber); // Abort the input
                setIsInputShown(false);
                break;
            default:
                break;
        }
    };

    React.useEffect(() => {
        setInputValue(pageNumber); // Keep internal state in sync with prop as it changes
    }, [pageNumber]);

    React.useLayoutEffect(() => {
        const { current: isRetry } = isRetryRef;

        if (inputElRef.current && isInputShown) {
            inputElRef.current.select();
        }

        if (buttonElRef.current && !isInputShown && isRetry) {
            isRetryRef.current = false;
            buttonElRef.current.focus();
        }
    }, [isInputShown]);

    return (
        <div className="bp-PageControlsForm">
            {isInputShown ? (
                <input
                    ref={inputElRef}
                    className="bp-PageControlsForm-input"
                    data-testid="bp-PageControlsForm-input"
                    disabled={pageCount <= 1}
                    min="1"
                    onBlur={handleNumInputBlur}
                    onChange={handleNumInputChange}
                    onKeyDown={handleNumInputKeyDown}
                    pattern="[0-9]*"
                    size={3}
                    title={__('enter_page_num')}
                    type="number"
                    value={inputValue.toString()}
                />
            ) : (
                <button
                    ref={buttonElRef}
                    className="bp-PageControlsForm-button"
                    data-testid="bp-PageControlsForm-button"
                    onClick={(): void => setIsInputShown(true)}
                    title={__('enter_page_num')}
                    type="button"
                >
                    <span
                        className="bp-PageControlsForm-button-label"
                        data-testid="bp-PageControlsForm-button-span"
                    >{`${pageNumber} / ${pageCount}`}</span>
                </button>
            )}
        </div>
    );
}
