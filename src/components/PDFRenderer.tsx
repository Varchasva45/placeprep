interface PdfRendererProps {
  fileName: string;
  fileUrl: string;
}

const PdfRenderer = ({ fileUrl }: PdfRendererProps) => {
  return (
    <iframe
      src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
      className="w-full h-full"
      style={{
        borderRadius: "10px",
      }}
    ></iframe>
  );
};

export default PdfRenderer;
