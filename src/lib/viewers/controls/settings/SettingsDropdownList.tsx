import React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';
import { useActiveIndex } from '../hooks';

export type Props = React.HTMLAttributes<Element> & {
    isOpen?: boolean;
};

export default function SettingsDropdownList({
    children,
    className,
    isOpen,
    onKeyDown = noop,
    ...rest
}: Props): JSX.Element {
    const { activeIndex, handlers } = useActiveIndex({ children, onKeyDown });
    const [activeItem, setActiveItem] = React.useState<HTMLDivElement | null>(null);

    React.useEffect(() => {
        if (activeItem) {
            activeItem.focus();
        }
    }, [activeItem]);

    return (
        <div
            className={classNames('bp-SettingsDropdownList', className, { 'bp-is-open': isOpen })}
            role="listbox"
            tabIndex={0}
            {...handlers}
            {...rest}
        >
            {React.Children.map(children, (listItem, itemIndex) => {
                if (React.isValidElement(listItem) && itemIndex === activeIndex) {
                    return React.cloneElement(listItem, { ref: setActiveItem, ...listItem.props });
                }

                return listItem;
            })}
        </div>
    );
}
