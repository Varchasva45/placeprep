import {Document, Page, pdfjs} from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
    ).toString();

const PDFRenderer = (url: any) => {
    return (
        <div className='w-full h-full bg-white rounded-md shadow flex flex-col items-center'>
            <div className='h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2'>
                <div className='flex items-center gap-1.5'>
                    Top Bar
                </div>
            </div>

            <div className='flex-1 w-full h-full max-h-screen'>
                <div>
                    <Document file={{url: 'https://drive.google.com/file/d/11bLER812HKRsJ87vV79p5bhIzKQ9MnlN/view'}} className='max-h-full'>
                        <Page pageNumber={1} />
                    </Document>
                </div>
            </div>
        </div>
    );
} 

export default PDFRenderer;