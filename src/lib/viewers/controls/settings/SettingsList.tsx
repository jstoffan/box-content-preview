import React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';
import { decodeKeydown } from '../../../util';

export type Props = React.PropsWithChildren<{
    className?: string;
    onKeyDown?: (event: React.KeyboardEvent) => void;
}> &
    React.HTMLAttributes<HTMLDivElement>;

function SettingsList(props: Props, ref: React.Ref<HTMLDivElement>): JSX.Element {
    const { children, className, onKeyDown = noop, ...rest } = props;
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [activeItem, setActiveItem] = React.useState<HTMLDivElement | null>(null);

    const handleKeyDown = (event: React.KeyboardEvent): void => {
        const key = decodeKeydown(event);
        const max = React.Children.toArray(children).length - 1;

        if (key === 'ArrowUp' && activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
        }

        if (key === 'ArrowDown' && activeIndex < max) {
            setActiveIndex(activeIndex + 1);
        }

        onKeyDown(event);
    };

    React.useEffect(() => {
        if (activeItem) {
            activeItem.focus();
        }
    }, [activeItem]);

    return (
        <div
            ref={ref}
            className={classNames('bp-SettingsList', className)}
            onKeyDown={handleKeyDown}
            role="listbox"
            tabIndex={0}
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

export default React.forwardRef<HTMLDivElement, Props>(SettingsList);
