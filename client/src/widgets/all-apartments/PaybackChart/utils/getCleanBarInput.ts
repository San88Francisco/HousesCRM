interface RawBarInput {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: {
    isFullyPaidBack: boolean;
    color: string;
    displayCoefficient: number;
    id: string;
  };
}

export interface CleanBarInput {
  x: number;
  y: number;
  width: number;
  height: number;
  payload: RawBarInput['payload'];
}

export const getCleanBarInput = (props: RawBarInput): CleanBarInput => {
  return {
    x: props.x ?? 0,
    y: props.y ?? 0,
    width: props.width ?? 0,
    height: props.height ?? 0,
    payload: props.payload,
  };
};
