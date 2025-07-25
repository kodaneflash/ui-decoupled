import React, { memo } from "react";
import * as d3shape from "d3-shape";
import * as d3scale from "d3-scale";
import maxBy from "lodash/maxBy";
import minBy from "lodash/minBy";
import Svg, { Path, Defs } from "react-native-svg";
import { useTheme } from "styled-components/native";
import DefGraph from "./DefGrad";
import BarInteraction from "./BarInteraction";
import type { Item, ItemArray } from "./types";

type Props = {
  width: number;
  height: number;
  /** Represents the offset to apply to the chart positioning on x-axis. Default to 0.  */
  xOffset?: number;
  /** Represents the offset to apply to the chart positioning on y-axis. Default to 10.  */
  yOffset?: number;
  data?: ItemArray;
  color: string;
  isInteractive: boolean;
  onItemHover?: (_: Item | null | undefined) => void;
  mapValue: (_: Item) => number;
  shape?: keyof typeof d3shape;
  verticalRangeRatio?: number;
  fill?: string;
  testID?: string;
};

const STROKE_WIDTH = 2;
const FOCUS_RADIUS = 4;

function Graph({
  width,
  height,
  xOffset = 0,
  yOffset = 10,
  data = [],
  color: initialColor,
  isInteractive = false,
  shape = "curveMonotoneX",
  mapValue,
  onItemHover,
  verticalRangeRatio = 2,
  fill,
  testID,
}: Props) {
  const { colors } = useTheme();
  const color = initialColor || colors.primary.c80;

  // Handle empty data gracefully
  if (!data || data.length === 0) {
    return (
      <Svg
        testID={testID}
        height={height}
        width={width}
        viewBox={`${xOffset * -1} ${yOffset * -1} ${width} ${height}`}
        preserveAspectRatio="none"
      />
    );
  }

  const maxY = mapValue(maxBy(data, mapValue)!);
  const minY = mapValue(minBy(data, mapValue)!);
  const paddedMinY = minY - (maxY - minY) / verticalRangeRatio;
  const curve = d3shape[shape] as d3shape.CurveFactory;
  
  const x = d3scale
    .scaleTime()
    .range([0, width])
    .domain([data[0].date!, data[data.length - 1].date!]);
    
  const y = d3scale
    .scaleLinear()
    .domain([paddedMinY, maxY])
    .range([height - STROKE_WIDTH, STROKE_WIDTH + FOCUS_RADIUS]);

  const yExtractor = (d: Item) => y(mapValue(d));

  const area = d3shape
    .area<Item>()
    .x(d => x(d.date!))
    .y0(() => height)
    .y1(d => yExtractor(d))
    .curve(curve)(data);

  const line = d3shape
    .line<Item>()
    .x(d => x(d.date!))
    .y(yExtractor)
    .curve(curve)(data);

  const content = (
    <Svg
      testID={testID}
      height={height}
      width={width}
      viewBox={`${xOffset * -1} ${yOffset * -1} ${width} ${height}`}
      preserveAspectRatio="none"
    >
      <Defs>
        <DefGraph height={height} color={color} />
      </Defs>
      <Path d={area ?? undefined} fill={fill || "url(#grad)"} />
      <Path d={line ?? undefined} stroke={color} strokeWidth={STROKE_WIDTH} fill="none" />
    </Svg>
  );

  return isInteractive ? (
    <BarInteraction
      width={width}
      height={height}
      data={data}
      color={color}
      mapValue={mapValue}
      onItemHover={onItemHover}
      xOffset={xOffset}
      yOffset={yOffset}
      x={x}
      y={y}
    >
      {content}
    </BarInteraction>
  ) : (
    content
  );
}

export default memo<Props>(Graph); 