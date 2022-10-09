export function getDateInDatePickerTitleFormat(date: Date): string {
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}

//Date in format yyyy-mm-dd
export function getDateInDatePickerValueFormat(date: Date): string {
    return [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
    ].join('-');
}

export function padTo2Digits(num: number): string {
    return num.toString().padStart(2, '0');
}

export function addMonths(numOfMonths: number, date = new Date()): Date {
    date.setMonth(date.getMonth() + numOfMonths);
    return date;
}

export function addDays(numOfDays: number, date = new Date()): Date {
    date.setDate(date.getDate() + numOfDays);
    return date;
}

//Date in format dd/mm/yyy
export function formatDate(date: Date): string {
    return [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
    ].join('/');
}