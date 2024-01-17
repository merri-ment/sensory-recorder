export default function (time) {
  const totalMilliseconds = time * 1000; // Convert seconds to milliseconds
  const minutes = Math.floor(totalMilliseconds / (60 * 1000));
  const seconds = Math.floor((totalMilliseconds % (60 * 1000)) / 1000);

  // Use padStart to ensure two-digit formatting for minutes, seconds, and milliseconds
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
