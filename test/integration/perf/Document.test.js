import FILES from './documents.json';

describe('Preview Perf', () => {
    const HEADER =
        'file_id,file_name,file_size,mode,variant,pdf_start_page_num,pdf_start_page_overall,pdf_start_page_render,pdf_start_page_request,preview_content_load,preview_files_load,preview_request_load,ux_start_page_load';
    const PAGE_N = 20;
    const STREAM = [false, true];
    let result = HEADER;

    const run = (fileObj, pageNumber, stream, variant) => {
        const { id: fileId, name, size } = fileObj;
        const fileOptions = {
            [fileId]: {
                startAt: {
                    unit: 'pages',
                    value: pageNumber,
                },
            },
        };
        const viewerOptions = {
            Document: {
                disableStream: !stream,
                rangeMinSize: 5242880,
            },
        };

        cy.showPreview(Cypress.env('TOKEN'), fileId, { fileOptions, viewers: viewerOptions });
        cy.getPreviewPage(pageNumber);
        cy.wait(1000); // eslint-disable-line cypress/no-unnecessary-waiting

        cy.window().then(win => {
            const mode = stream ? 'stream' : 'load';

            if (win.stats) {
                const statStr = Object.values(win.stats).join(',');
                result += `\r${fileId},${name},${size},${mode},${variant},${statStr}`;
            }
        });
    };

    beforeEach(() => {
        cy.visit('/');
    });

    after(() => {
        cy.writeFile(`test/perf/${new Date().toISOString()}.csv`, result);
    });

    STREAM.forEach(stream => {
        Object.keys(FILES).forEach(variant => {
            FILES[variant].forEach(fileObj => {
                it(`should ${stream ? 'stream' : 'load'} ${variant} file ${fileObj.id} on page 1`, () => {
                    run(fileObj, 1, stream, variant);
                });
            });

            FILES[variant].forEach(fileObj => {
                it(`should ${stream ? 'stream' : 'load'} ${variant} file ${fileObj.id} on page ${PAGE_N}`, () => {
                    run(fileObj, PAGE_N, stream, variant);
                });
            });
        });
    });
});
