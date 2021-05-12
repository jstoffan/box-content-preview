import * as React from 'react';
import noop from 'lodash/noop';
import { decodeKeydown } from '../../../util';

export type Props = React.PropsWithChildren<{
    onKeyDown?: (event: React.KeyboardEvent) => void;
}>;

export type Value = {
    activeIndex: number;
    handlers: {
        onKeyDown: (event: React.KeyboardEvent) => void;
    };
};

export default function useActiveIndex({ children, onKeyDown = noop }: Props): Value {
    const [activeIndex, setActiveIndex] = React.useState(0);

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

    return {
        activeIndex,
        handlers: {
            onKeyDown: handleKeyDown,
        },
    };
}
