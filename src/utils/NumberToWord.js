export default function (number) {
  // Function to convert a number to its word representation
  function convertToWord(number) {
    const words = [
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
    ];
    const tens = [
      "twenty",
      "thirty",
      "forty",
      "fifty",
      "sixty",
      "seventy",
      "eighty",
      "ninety",
    ];

    if (number === 0) {
      return "one";
    }

    if (number < 20) {
      return words[number - 1];
    }

    if (number < 100) {
      const digit1 = Math.floor(number / 10);
      const digit2 = number % 10;

      if (digit2 === 0) {
        return tens[digit1 - 2];
      } else {
        return `${tens[digit1 - 2]}-${words[digit2 - 1]}`;
      }
    }

    // You can extend this logic for numbers greater than 100 if needed
    return "undefined";
  }

  const numberMap = [];
  for (let i = 0; i < 100; i++) {
    // Assuming you want the word representation of the index + 1
    const wordRepresentation = convertToWord(i + 1); // You can define a function for this
    numberMap.push(wordRepresentation);
  }

  return numberMap[number];
}
