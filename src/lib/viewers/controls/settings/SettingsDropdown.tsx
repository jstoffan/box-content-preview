import React from 'react';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import SettingsFlyout from './SettingsFlyout';
import SettingsDropdownList from './SettingsDropdownList';
import { decodeKeydown } from '../../../util';
import { useClickOutside } from '../hooks';
import './SettingsDropdown.scss';

export type ListItem = {
    label: string;
    value: string;
};

export type Props = {
    className?: string;
    label: string;
    listItems: Array<ListItem>;
    onSelect: (value: string) => void;
    value?: string;
};

export default function SettingsDropdown({ className, label, listItems, onSelect, value }: Props): JSX.Element {
    const { current: id } = React.useRef(uniqueId('bp-SettingsDropdown_'));
    const buttonElRef = React.useRef<HTMLButtonElement | null>(null);
    const dropdownElRef = React.useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = React.useState(false);

    const handleClick = (event: React.MouseEvent): void => {
        // Prevent the event from bubbling up and triggering any upstream click handling logic,
        // i.e. if the dropdown is nested inside a menu flyout
        event.stopPropagation();
    };

    const handleKeyDown = (event: React.KeyboardEvent): void => {
        const key = decodeKeydown(event);

        if (key === 'Escape') {
            setIsOpen(false);

            if (buttonElRef.current) {
                buttonElRef.current.focus(); // Prevent focus from falling back to the body on flyout close
            }
        }

        if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'Escape') {
            // Prevent the event from bubbling up and triggering any upstream keydown handling logic
            event.stopPropagation();
        }
    };

    useClickOutside(dropdownElRef, () => setIsOpen(false));

    return (
        <div ref={dropdownElRef} className={classNames('bp-SettingsDropdown', className)}>
            <div className="bp-SettingsDropdown-label" id={`${id}-label`}>
                {label}
            </div>
            <button
                ref={buttonElRef}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-labelledby={`${id}-label ${id}-button`}
                className={classNames('bp-SettingsDropdown-button', { 'bp-is-open': isOpen })}
                id={`${id}-button`}
                onClick={(): void => setIsOpen(!isOpen)}
                type="button"
            >
                {value}
            </button>
            <SettingsDropdownList
                aria-labelledby={`${id}-label`}
                className="bp-SettingsDropdown-list"
                isOpen={isOpen}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                role="listbox"
                tabIndex={-1}
            >
                {listItems.map(({ label: itemLabel, value: itemValue }) => (
                    <div
                        key={itemValue}
                        aria-selected={value === itemValue}
                        className="bp-SettingsDropdown-listitem"
                        id={itemValue}
                        onClick={(): void => {
                            setIsOpen(false);
                            onSelect(itemValue);
                        }}
                        onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>): void => {
                            const key = decodeKeydown(event);

                            if (key === 'Space' || key === 'Enter') {
                                setIsOpen(false);
                                onSelect(itemValue);
                            }
                        }}
                        role="option"
                        tabIndex={0}
                    >
                        {itemLabel}
                    </div>
                ))}
            </SettingsDropdownList>
        </div>
    );
}
