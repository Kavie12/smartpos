export default function getDateTime(): string {

    const nameOfMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const dayWithSuffix = getOrdinalSuffix(day);
    const hours24 = date.getHours();
    const hours12 = hours24 % 12 || 12;
    const amPm = hours24 >= 12 ? "PM" : "AM";
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours12}:${minutes} ${amPm}, ${dayWithSuffix} ${nameOfMonths[month]} ${year}`;
}

function getOrdinalSuffix(n: number) {
    if (n > 3 && n < 21) return n + "th";
    switch (n % 10) {
        case 1: return n + "st";
        case 2: return n + "nd";
        case 3: return n + "rd";
        default: return n + "th";
    }
}