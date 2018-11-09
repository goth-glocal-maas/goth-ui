export const TRANSPORT_MODES = [
  'TRANSIT,WALK',
  // 'TRANSIT,BICYCLE',
  'WALK',
  'BICYCLE',
  'CAR',
]

export const MODE_STYLES = {
  'WALK': {
    color: "#a63eff",
    weight: 5,
    opacity: 0.65,
    dashArray: "12 8",
  },
  'BICYCLE': {
    color: "#ff7473",
    weight: 5,
    opacity: 0.65,
    dashArray: "8 8",
  },
  'CAR': {
    color: "#fa853e",
    weight: 8,
    opacity: 0.65,
    dashArray: "0",
  },
  'BUS': {
    color: "#1952e2",
    weight: 8,
    opacity: 0.65,
    dashArray: "0",
  }
}
