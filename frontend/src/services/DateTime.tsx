export default function getDateTime(): string {

    const nameOfMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours > 12 ? "PM" : "AM";


    return `${hours}:${minutes} ${amOrPm}, ${day} ${nameOfMonths[month]} ${year}`;
}