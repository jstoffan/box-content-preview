import React from 'react';
import { decodeKeydown } from '../../../util';
import './PageControlsForm.scss';

export type Props = {
    onPageChange: (newPageNumber: number) => void;
    pageNumber: number;
    pageCount: number;
};

const EMPTY = 'Empty';
const ENTER = 'Enter';
const TAB = 'Tab';
const ESCAPE = 'Escape';

export function PageControlsForm(
    { onPageChange, pageNumber, pageCount }: Props,
    nextPageButtonRef?: React.Ref<HTMLButtonElement>,
): JSX.Element {
    const [isInputShown, setIsInputShown] = React.useState(false);
    const [pageInputValue, setPageInputValue] = React.useState(pageNumber.toString());
    const lastNumInputKeyDown = React.useRef<typeof EMPTY | typeof ENTER | typeof TAB | typeof ESCAPE>(EMPTY);
    const numPageButtonRef = React.useRef<HTMLButtonElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const setLastNumInputKeyDown = (action: typeof EMPTY | typeof ENTER | typeof TAB | typeof ESCAPE): void => {
        lastNumInputKeyDown.current = action;
    };

    const setPage = (): void => {
        const newPageNumber = parseInt(pageInputValue, 10);

        if (!Number.isNaN(newPageNumber)) {
            onPageChange(newPageNumber);
        }
    };

    const handleNumInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setPageInputValue(event.target.value);
    };

    const handleNumInputBlur = (): void => {
        setPage();
        setLastNumInputKeyDown(EMPTY);
        setIsInputShown(false);
    };

    const handleNumInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        const key = decodeKeydown(event);

        switch (key) {
            case ENTER:
                setPage();
                setLastNumInputKeyDown(ENTER);
                setIsInputShown(false);

                event.stopPropagation();
                event.preventDefault();
                break;
            case TAB:
                setPage();
                setLastNumInputKeyDown(TAB);
                setIsInputShown(false);

                event.stopPropagation();
                event.preventDefault();
                break;

            case ESCAPE:
                setLastNumInputKeyDown(ESCAPE);
                setIsInputShown(false);

                event.stopPropagation();
                event.preventDefault();
                break;
            default:
                break;
        }
    };

    React.useEffect(() => {
        if (inputRef.current && isInputShown) {
            setPageInputValue(pageNumber.toString());
            inputRef.current.select();
        }

        if (numPageButtonRef.current && !isInputShown) {
            switch (lastNumInputKeyDown.current) {
                case TAB:
                    if (nextPageButtonRef && nextPageButtonRef.current) {
                        nextPageButtonRef.current.focus();
                        setLastNumInputKeyDown(EMPTY);
                    }
                    break;
                case ENTER:
                case ESCAPE:
                    if (numPageButtonRef && numPageButtonRef.current) {
                        numPageButtonRef.current.focus();
                        setLastNumInputKeyDown(EMPTY);
                    }
                    break;
                default:
                    break;
            }
        }
    }, [isInputShown, nextPageButtonRef, pageNumber]);

    return (
        <div className="bp-PageControlsForm">
            {isInputShown ? (
                <input
                    ref={inputRef}
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
                    value={pageInputValue}
                />
            ) : (
                <button
                    ref={numPageButtonRef}
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

export default React.forwardRef<HTMLButtonElement, Props>(PageControlsForm);
