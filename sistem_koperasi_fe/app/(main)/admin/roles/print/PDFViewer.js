'use client'

import React, { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Button } from 'primereact/button'

import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString()

function PDFViewerRoles({ pdfUrl, paperSize, fileName }) {
    const [numPages, setNumPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageWidth, setPageWidth] = useState(0);
    const [pageHeight, setPageHeight] = useState(0);
    const [scale, setScale] = useState(1);

    const handleFirstPage = () => setCurrentPage(1);
    const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
    const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, numPages));
    const handleLastPage = () => setCurrentPage(numPages);

    const handleZoomIn = () => setScale((s) => Math.min(s + 0.1, 2.0));
    const handleZoomOut = () => setScale((s) => Math.max(s - 0.1, 0.5));

    const handleDownloadPDF = () => {
        const downloadLink = document.createElement('a');
        downloadLink.href = pdfUrl;
        downloadLink.download = fileName + '.pdf';
        downloadLink.click();
    };

    const handlePrint = () => {
        if (!pdfUrl) return;
        if (pdfUrl.startsWith('data:application/pdf')) {
            const base64Data = pdfUrl.split(',')[1];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, '_blank');
        } else {
            window.open(pdfUrl, '_blank');
        }
    };

    useEffect(() => {
        const loadPdf = async () => {
            if (!pdfUrl) return;
            const loadingTask = pdfjs.getDocument({ url: pdfUrl });
            const pdf = await loadingTask.promise;
            setNumPages(pdf.numPages);

            const mmToPixel = 3.7795275591;
            let paperWidthInMm, paperHeightInMm;

            if (paperSize === 'A4') {
                paperWidthInMm = 210;
                paperHeightInMm = 297;
            } else if (paperSize === 'Letter') {
                paperWidthInMm = 216;
                paperHeightInMm = 279;
            } else if (paperSize === 'Legal') {
                paperWidthInMm = 216;
                paperHeightInMm = 356;
            } else {
                paperWidthInMm = 216;
                paperHeightInMm = 279;
            }

            setPageWidth(paperWidthInMm * mmToPixel);
            setPageHeight(paperHeightInMm * mmToPixel);
        };

        loadPdf();
    }, [pdfUrl, paperSize]);

    return (
        <div>
            {pdfUrl && numPages !== null && (
                <div>
                    <div className="flex flex-wrap justify-content-center gap-2 p-2 bg-gray-100 shadow-md sticky top-0 z-10">
                        <Button icon="pi pi-angle-double-left" onClick={handleFirstPage} disabled={currentPage === 1} />
                        <Button icon="pi pi-angle-left" onClick={handlePrevPage} disabled={currentPage === 1} />
                        <Button icon="pi pi-search-plus" onClick={handleZoomIn} disabled={scale >= 2.0} />
                        <Button icon="pi pi-search-minus" onClick={handleZoomOut} disabled={scale <= 0.5} />
                        <Button icon="pi pi-angle-right" onClick={handleNextPage} disabled={currentPage === numPages} />
                        <Button icon="pi pi-angle-double-right" onClick={handleLastPage} disabled={currentPage === numPages} />
                        <Button icon="pi pi-download" severity="success" onClick={handleDownloadPDF} />
                        <Button icon="pi pi-print" severity="info" onClick={handlePrint} />
                    </div>
                    <div style={{ overflow: 'auto', height: '65vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Document file={pdfUrl}>
                            <Page pageNumber={currentPage} width={pageWidth} height={pageHeight} scale={scale} />
                        </Document>
                    </div>
                    <div className="text-center text-gray-500 text-sm mt-2">
                        Page {currentPage} of {numPages}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PDFViewerRoles;