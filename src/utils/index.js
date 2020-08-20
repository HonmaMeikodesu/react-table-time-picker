export function formatTime(time) {
  const beginRes = Number.parseInt(time[0], 10);
  const endRes = Number.parseInt(time[1], 10);
  const begin = beginRes >= 0 ? `${Math.floor(beginRes / 60)}:${beginRes % 60 < 10 ? '0'.concat(beginRes % 60) : beginRes % 60}` : '';
  const end = endRes >= 0 ? `${Math.floor(endRes / 60)}:${endRes % 60 < 10 ? '0'.concat(endRes % 60) : endRes % 60}` : '';
  return [begin, end];
}
export default {};
