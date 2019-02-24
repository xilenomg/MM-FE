export function formatFlightDuration(duration) {
  if (duration < 60) {
    return `0h${duration}min`;
  }

  const durationInHours = parseInt(duration / 60);
  const minutesDuration = duration - durationInHours * 60;
  return `${durationInHours}h${minutesDuration}min`;
}

export function formatFlightDate(date) {
  const newDate = new Date(date.replace("Z", "-0300"));
  const hours =
    newDate.getHours() < 10 ? `0${newDate.getHours()}` : newDate.getHours();
  const minutes =
    newDate.getMinutes() < 10
      ? `0${newDate.getMinutes()}`
      : newDate.getMinutes();
  return `${newDate.getDate()}/${newDate.getMonth() +
    1}/${newDate.getFullYear()} ${hours}:${minutes}`;
}

export function formatFlightPrice(price) {
  return `R$${price.toFixed(2)}`.replace(".", ",");
}

export function formatTripDate(date) {
  const newDate = new Date(date);
  const day =
    newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate();
  const month =
    newDate.getMonth() < 10
      ? `0${newDate.getMonth() + 1}`
      : newDate.getMonth() + 1;

  return `${newDate.getFullYear()}-${month}-${day}`;
}
