import React from 'react';
import classNames from 'classnames';
import SettingsContext, { Menu } from './SettingsContext';
import { useActiveIndex } from '../hooks';
import './SettingsMenu.scss';

export type Props = React.PropsWithChildren<{
    className?: string;
    name: Menu;
}>;

export default function SettingsMenu({ children, className, name }: Props): JSX.Element | null {
    const { activeMenu, setActiveRect } = React.useContext(SettingsContext);
    const { activeIndex, handlers } = useActiveIndex({ children });
    const [activeItem, setActiveItem] = React.useState<HTMLDivElement | null>(null);
    const isActive = activeMenu === name;
    const menuElRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const { current: menuEl } = menuElRef;

        if (menuEl && isActive) {
            setActiveRect(menuEl.getBoundingClientRect());
        }
    }, [isActive, setActiveRect]);

    React.useEffect(() => {
        if (activeItem && isActive) {
            activeItem.focus();
        }
    }, [activeItem, isActive]);

    return (
        <div
            ref={menuElRef}
            className={classNames('bp-SettingsMenu', className, { 'bp-is-active': isActive })}
            role="menu"
            tabIndex={0}
            {...handlers}
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
