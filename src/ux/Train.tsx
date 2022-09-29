import { ReactNode, useMemo } from "react";
interface ITrainData {
  time: Date;
  hasEvent: boolean;
  eventType: string;
  hoverRenderer?: ReactNode;
  context?: any;
}
const timeRange = (n: number, b: number, i: number) =>
  [...Array(n).keys()].map((o) => new Date(b + ((o + 1) * i)));

const TrainUX = ({
  data,
  startDate = new Date(),
  boxes = 30,
  interval = 30,
}: {
  data: ITrainData[];
  startDate?: Date;
  boxes?: number;
  interval?: number;
}) => {
  const ranges = useMemo(() => timeRange(boxes, startDate.getTime(), interval * 1000), [boxes, interval, startDate]);

  let lastInterval = startDate;
  const uxBoxes = useMemo(() => ranges.map((o, i) => {
    const events = data.filter((t) => t.time >= lastInterval && t.time < o);
    lastInterval = o;
    return <TrainUXBox key={i} data={events}></TrainUXBox>;
  }), [ranges, data]);
  return (
    <section>
      <h1>Train Boxes</h1>
      {uxBoxes}
    </section>
  );
};

const TrainUXBox = ({ data }: { data?: ITrainData[] }) => {
  return (
    <div
      style={{
        width: "1.5rem",
        height: "1.5rem",
        border: "1px solid #000",
        boxSizing: "border-box",
        display: "inline-block",
      }}
    >
      {data && data.length}
    </div>
  );
};
export default TrainUX;
