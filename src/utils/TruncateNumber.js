/* 
let originalNumber = 0.23200023;
let truncatedNumber = Number(originalNumber, 3); 
 */

export default function (number, decimalPlaces) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(number * factor) / factor;
}
