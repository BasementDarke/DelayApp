export interface JourneyResponse {
  api: string;
  time: string;
  id: string;
  journeys: Journey[];
}

export interface Journey {
  id: number;
  journeyKey: string;
  routeLinks: RouteLink[];
}

export interface RouteLink {
  id: string | null;
  from: RouteStation | null;
  to: RouteStation | null;
  line: RouteLine;
}

export interface RouteStation {
  name: string;
  time: string;
  deviation: number | null;
  passed: boolean | null;
}

export interface RouteLine {
  name: string;
  type: string | null;
  no: string | null;
  lineNo: number | null;
}
