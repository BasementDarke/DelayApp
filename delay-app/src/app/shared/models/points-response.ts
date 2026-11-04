export interface PointsResponse {
  api: string
  points: Point[]
}

export interface Point {
  name: string
  type: string
}
