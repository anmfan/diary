export function formatDateShort(dateString: string): string {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        console.error(`Invalid date format: ${dateString}`);
        return "Invalid Date";
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).split("")

    return `${day}.${month}.${year[2] + year[3]}`;
}