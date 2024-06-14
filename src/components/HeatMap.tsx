import HeatMap from '@uiw/react-heat-map';

const ProblemHeatMap = (commitsData: any) => {
  return (
      <HeatMap
        className='w-full -mb-4'
        value={commitsData.commitsData}
        startDate={new Date(commitsData.commitsData[0].date)}
        width={600}
        legendRender={(props: any) => <rect {...props} y={props.y + 10} rx={5} />}
        panelColors={{ 0: '#EBEDF0', 20: '#C6E48B', 40: '#7BC96F', 60: '#239A3B', 80: '#196127' }}
      />
  )
};

export default ProblemHeatMap;