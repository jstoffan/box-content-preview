import SVGViewer from '../SVGViewer';

describe('lib/viewers/image/SVGViewer', () => {
    const sandbox = sinon.sandbox.create();
    const imageEl = {
        getAttribute: name => imageEl[name],
        setAttribute: (name, value) => {
            imageEl[name] = value;
        },
        src: '/test',
    };
    let stubs;
    let viewer;

    beforeEach(() => {
        stubs = {
            api: {
                get: sandbox.stub(),
            },
        };
        viewer = new SVGViewer({
            api: stubs.api,
            file: {
                id: '1234',
            },
        });
        viewer.imageEl = document.createElement('div');
    });

    afterEach(() => {
        sandbox.verifyAndRestore();

        if (viewer && typeof viewer.destroy === 'function') {
            viewer.destroy();
        }
    });

    describe('setOriginalImageSize', () => {
        it('should fetch the content for parsing', done => {
            const getStub = stubs.api.get.resolves('');

            viewer.setOriginalImageSize(imageEl).then(() => {
                expect(getStub).to.have.been.calledWith('/test', { type: 'text' });
                done();
            });
        });

        it('should use the image height and width if available', done => {
            stubs.api.get.resolves(`
                <svg xmlns="http://www.w3.org/2000/svg" height="100" width="75" viewBox="0 0 200 100" focusable="false">
                    <rect width="10" height="1" x="0.5" y="0.5" stroke="#000" />
                </svg>
            `);

            viewer.setOriginalImageSize(imageEl).then(() => {
                expect(imageEl.getAttribute('originalHeight')).to.equal('100');
                expect(imageEl.getAttribute('originalWidth')).to.equal('75');
                done();
            });
        });

        it('should use the image viewbox if available and no height or width are defined', done => {
            stubs.api.get.resolves(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" focusable="false">
                    <rect width="10" height="1" x="0.5" y="0.5" stroke="#000" />
                </svg>
            `);

            viewer.setOriginalImageSize(imageEl).then(() => {
                expect(imageEl.getAttribute('originalHeight')).to.equal('100');
                expect(imageEl.getAttribute('originalWidth')).to.equal('200');
                done();
            });
        });

        it('should set sane defaults if the image is very small', done => {
            stubs.api.get.resolves(`
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" viewBox="0 0 10 2" focusable="false">
                    <rect width="10" height="1" x="0.5" y="0.5" stroke="#000" />
                </svg>
            `);

            viewer.setOriginalImageSize(imageEl).then(() => {
                expect(imageEl.getAttribute('originalHeight')).to.equal('150');
                expect(imageEl.getAttribute('originalWidth')).to.equal('300');
                done();
            });
        });

        it('should resolve when the get call fails', done => {
            stubs.api.get.rejects();
            viewer
                .setOriginalImageSize({})
                .then(() => Assert.fail())
                .catch(() => done());
        });
    });
});
