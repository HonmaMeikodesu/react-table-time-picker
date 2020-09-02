export function formatTime(time) {
  const beginRes = Number.parseInt(time[0], 10);
  const endRes = Number.parseInt(time[1], 10);
  const begin = beginRes >= 0 ? `${Math.floor(beginRes / 60)}:${beginRes % 60 < 10 ? '0'.concat(beginRes % 60) : beginRes % 60}` : '';
  const end = endRes >= 0 ? `${Math.floor(endRes / 60)}:${endRes % 60 < 10 ? '0'.concat(endRes % 60) : endRes % 60}` : '';
  return [begin, end];
}
function isInteger(num) {
  // eslint-disable-next-line no-bitwise
  return (num | 0) === num;
}
export function calculateIdxFromId(id, minuteStep, hourStep) {
  if (!isInteger((Number.parseInt(id, 10) % (hourStep * 60)) / minuteStep)) throw new Error('arguments passed in do not match the stepping pattern!');
  return (Math.floor(Number.parseInt(id, 10) / (hourStep * 60)) * Math.ceil(60 / minuteStep) + ((Number.parseInt(id, 10) % (hourStep * 60)) / minuteStep));
}
export default {};
