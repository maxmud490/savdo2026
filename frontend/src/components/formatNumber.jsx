export function formatLargeNumber(number) {
    if (typeof number !== "undefined" && number !== null) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    return "";
  }