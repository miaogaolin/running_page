import { lazy, Suspense } from 'react';
import Stat from '@/components/Stat';
import useActivities from '@/hooks/useActivities';
import { formatPace,filterYearRuns } from '@/utils/utils';
import useHover from '@/hooks/useHover';
import { yearStats } from '@assets/index';
import { loadSvgComponent } from '@/utils/svgUtils';
import { SHOW_ELEVATION_GAIN } from "@/utils/const";

const YearStat = ({ year, onClick }: { year: string, onClick: (_year: string, _typ: string) => void }) => {
  let { activities: runs, years } = useActivities();
  // for hover
  const [hovered, eventHandlers] = useHover();
  // lazy Component
  const YearSVG = lazy(() => loadSvgComponent(yearStats, `./year_${year}.svg`));

  let activityType = '';
  if (years.includes(year)) {
    runs = runs.filter((run) =>filterYearRuns(run, year, activityType) );
  }
  let sumDistance = 0;
  let streak = 0;
  let sumElevationGain = 0;
  let pace = 0; // eslint-disable-line no-unused-vars
  let paceNullCount = 0; // eslint-disable-line no-unused-vars
  let heartRate = 0;
  let heartRateNullCount = 0;
  let totalMetersAvail = 0;
  let totalSecondsAvail = 0;
  let data = new Map<string,number>();
  runs.forEach((run) => {
    data.set(run.type, (data.get(run.type) || 0) + run.distance);
    sumDistance += run.distance || 0;
    sumElevationGain += run.elevation_gain || 0;
    if (run.average_speed) {
      pace += run.average_speed;
      totalMetersAvail += run.distance || 0;
      totalSecondsAvail += (run.distance || 0) / run.average_speed;
    } else {
      paceNullCount++;
    }
    if (run.average_heartrate) {
      heartRate += run.average_heartrate;
    } else {
      heartRateNullCount++;
    }
    if (run.streak) {
      streak = Math.max(streak, run.streak);
    }
  });
  sumDistance = parseFloat((sumDistance / 1000.0).toFixed(2));
  sumElevationGain = (sumElevationGain).toFixed(0);
  const avgPace = formatPace(totalMetersAvail / totalSecondsAvail);
  const hasHeartRate = !(heartRate === 0);
  const avgHeartRate = (heartRate / (runs.length - heartRateNullCount)).toFixed(
    0
  );
  return (
    <div
      className="cursor-pointer"
      {...eventHandlers}
    >
      <section>
        <Stat value={year} description={` ${sumDistance} KM`} onClick={() => onClick(year, '')}/>
        {Array.from(data.entries()).map(([key, value]) => (
             <Stat value={key} description={` ${(value/1000).toFixed(2)} KM`} onClick={() => onClick(year, key)}/>
        ))}
        <Stat value={`${streak} day`} description=" Streak" />
      </section>
      <hr color="red" />
    </div>
  );
};

export default YearStat;
