import React from 'react';
import isFinite from 'lodash/isFinite';
import noop from 'lodash/noop';
import { bdlBoxBlue, bdlGray62, white } from 'box-ui-elements/es/styles/variables';
import SliderControl, { Ref as SliderControlRef } from '../slider';
import './TimeControls.scss';
import Filmstrip from './Filmstrip';

export type Props = {
    aspectRatio?: number;
    bufferedRange?: TimeRanges;
    currentTime?: number;
    durationTime?: number;
    filmstripInterval?: number;
    filmstripUrl?: string;
    onTimeChange: (volume: number) => void;
};

export const round = (value: number): number => {
    return +value.toFixed(4);
};

export const percent = (value1: number, value2: number): number => {
    return round((value1 / value2) * 100);
};

export default function TimeControls({
    aspectRatio = 1,
    bufferedRange,
    currentTime = 0,
    durationTime = 0,
    filmstripInterval,
    filmstripUrl,
    onTimeChange,
}: Props): JSX.Element {
    const [isSliderHovered, setIsSliderHovered] = React.useState(false);
    const [hoverPosition, setHoverPosition] = React.useState(0);
    const [hoverPositionMax, setHoverPositionMax] = React.useState(0);
    const [hoverTime, setHoverTime] = React.useState(0);
    const bufferedAmount = bufferedRange && bufferedRange.length ? bufferedRange.end(bufferedRange.length - 1) : 0;
    const bufferedPercentage = percent(bufferedAmount, durationTime);
    const currentPercentage = isFinite(currentTime) && isFinite(durationTime) ? percent(currentTime, durationTime) : 0;

    const handleChange = (newValue: number): void => {
        onTimeChange(newValue);
    };

    const handleMouseMove = ({ currentTarget, pageX }: React.MouseEvent<SliderControlRef>): void => {
        const { left: timeLeft, width: timeWidth } = currentTarget.getBoundingClientRect();
        const eventPosition = Math.min(Math.max(0, pageX - timeLeft + 3), timeWidth);
        const eventPositionRatio = Math.min(Math.max(0, eventPosition / timeWidth), 1);
        const eventTime = Math.floor(eventPositionRatio * durationTime);

        setHoverPosition(eventPosition);
        setHoverPositionMax(timeWidth);
        setHoverTime(eventTime);
    };

    return (
        <div className="bp-TimeControls">
            {!!filmstripInterval && (
                <Filmstrip
                    aspectRatio={aspectRatio}
                    imageUrl={filmstripUrl}
                    interval={filmstripInterval}
                    isShown={isSliderHovered}
                    position={hoverPosition}
                    positionMax={hoverPositionMax}
                    time={hoverTime}
                />
            )}

            <SliderControl
                className="bp-TimeControls-slider"
                max={durationTime}
                onBlur={noop}
                onChange={handleChange}
                onFocus={noop}
                onMouseMove={filmstripInterval ? handleMouseMove : undefined}
                onMouseOut={(): void => setIsSliderHovered(false)}
                onMouseOver={(): void => setIsSliderHovered(true)}
                step={0.01}
                title={__('media_time_slider')}
                track={`linear-gradient(to right, ${bdlBoxBlue} ${currentPercentage}%, ${white} ${currentPercentage}%, ${white} ${bufferedPercentage}%, ${bdlGray62} ${bufferedPercentage}%, ${bdlGray62} 100%)`}
                value={currentTime}
            />
        </div>
    );
}
