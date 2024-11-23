const OutputWindow = (outputDetails: any) => {
  const getOutput = () => {
    let statusId = outputDetails?.outputDetails?.status?.id;

    if (statusId === 6) {
      // compilation error
      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500">
          {atob(outputDetails?.outputDetails?.compile_output)}
        </pre>
      );
    } else if (statusId === 3) {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-green-500">
          {atob(outputDetails?.outputDetails.stdout) !== null
            ? `${atob(outputDetails?.outputDetails.stdout)}`
            : null}
        </pre>
      );
    } else if (statusId === 5) {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500">
          {`Time Limit Exceeded`}
        </pre>
      );
    } else {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500">
          {atob(outputDetails?.outputDetails?.stderr)}
        </pre>
      );
    }
  };
  return (
    <>
      <div className="w-full h-64 mb-1 p-2 text-white/65 font-normal text-sm overflow-y-auto" style={{background: '#1E1E1E'}}>
        {outputDetails?.outputDetails ? <>{getOutput()}</> : 'Output'}
      </div>
    </>
  );
};

export default OutputWindow;
