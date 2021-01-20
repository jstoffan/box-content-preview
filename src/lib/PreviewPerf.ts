import { getFCP, getFID, getLCP, Metric } from 'web-vitals';

type PerformanceReport = {
    fcp?: number;
    fid?: number;
    lcp?: number;
};

// export function isRegion(annotation: Annotation): annotation is AnnotationRegion {
//     return annotation?.target?.type === 'region';
// }

export function isSupported(name: string): name is keyof PerformanceReport {
    return name === 'FCP' || name === 'FID' || name === 'LCP';
}

export default class PreviewPerf {
    private performanceReport: PerformanceReport = {};

    /**
     * Performance metrics are recorded in a global context. We use only unbuffered metrics to avoid skewed data,
     * as buffered values can be set based on whatever page the user *first* landed on, which may not be preview.
     *
     * Glossary:
     *  - FCP - First Contentful Paint (usually loading screen)
     *  - LCP - Largest Contentful Paint (usually full content preview)
     */
    constructor() {
        getFCP(this.handleMetric);
        getFID(this.handleMetric);
        getLCP(this.handleMetric);
    }

    protected handleMetric = ({ name, value }: Metric): void => {
        if (isSupported(name)) {
            this.performanceReport[name] = Math.round(value || 0);
        }

        console.log(name, value);
    };

    /**
     * Returns defined metrics if the following conditions are satisfied:
     *  1) it's recorded by the browser at all (some are Chrome-only, for now)
     *  2) if it was logged *after* the Preview SDK was loaded (not buffered)
     */
    public report(): PerformanceReport {
        return this.performanceReport;
    }
}
