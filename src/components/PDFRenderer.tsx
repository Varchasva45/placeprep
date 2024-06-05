interface PdfRendererProps {
  fileName: string
  fileUrl: string
}

const PdfRenderer = ({ fileUrl }: PdfRendererProps) => {

  return (
    // <div className='w-full h-full bg-white rounded-md shadow flex flex-col items-center'>
    //   {/* <div className='h-14 w-full border-b border-zinc-200 flex items-center justify-center space-x-2 px-2'>
    //     <div>
    //         <p className='font-bold text-lg pl-2'>{fileName}</p>
    //     </div>
    //     <div>
    //         <PdfFullscreen fileUrl={'https://testplaceprep.s3.ap-south-1.amazonaws.com/Varchasva_Resume.pdf'} />
    //     </div>
    //   </div> */}

    //   <div className='flex-1 w-full h-full max-h-screen'>
    //     <iframe
    //         src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
    //         className="w-full h-full roudned-md"
    //     ></iframe>
    //   </div>
    // </div>
    <iframe
        src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
        className="w-full h-full roudned-md"
    ></iframe>
  )
}

export default PdfRenderer