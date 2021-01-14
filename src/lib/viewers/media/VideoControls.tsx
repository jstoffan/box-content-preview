import React from 'react';
import DurationLabels, { Props as DurationLabelsProps } from '../controls/media/DurationLabels';
import FullscreenToggle, { Props as FullscreenToggleProps } from '../controls/fullscreen';
import PlayPauseToggle, { Props as PlayControlsProps } from '../controls/media/PlayPauseToggle';
import SettingsControls from '../controls/media/SettingsControls';
import TimeControls, { Props as TimeControlsProps } from '../controls/media/TimeControls';
import VolumeControls, { Props as VolumeControlsProps } from '../controls/media/VolumeControls';
import './VideoControls.scss';

export type Props = DurationLabelsProps &
    FullscreenToggleProps &
    PlayControlsProps &
    TimeControlsProps &
    VolumeControlsProps;

export default function VideoControls({
    bufferedRange,
    currentTime,
    durationTime,
    isPlaying,
    onFullscreenToggle,
    onMuteChange,
    onPlayPause,
    onTimeChange,
    onVolumeChange,
    volume,
}: Props): JSX.Element {
    return (
        <div className="bp-VideoControls">
            <TimeControls
                bufferedRange={bufferedRange}
                currentTime={currentTime}
                durationTime={durationTime}
                onTimeChange={onTimeChange}
            />

            <div className="bp-VideoControls-bar">
                <div className="bp-VideoControls-group">
                    <PlayPauseToggle isPlaying={isPlaying} onPlayPause={onPlayPause} />
                    <VolumeControls onMuteChange={onMuteChange} onVolumeChange={onVolumeChange} volume={volume} />
                    <DurationLabels currentTime={currentTime} durationTime={durationTime} />
                </div>

                <div className="bp-VideoControls-group">
                    <SettingsControls />
                    <FullscreenToggle onFullscreenToggle={onFullscreenToggle} />
                </div>
            </div>
        </div>
    );
}
