export function dateToTimestampString(date: Date, isNow: boolean = false) {
    const now = isNow ? date : new Date();
    //const diff = now.getTime() - date.getTime();
    //if (diff < 60 * 1000) return `A few seconds ago`
    if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
        const dayDiff = date.getDate() - now.getDate();
        if (dayDiff <= 0 && dayDiff >= -1) return `${dayDiff === 0 ? 'Today' : 'Yesterday'} at ${num2Chars(date.getHours())}:${num2Chars(date.getMinutes())}`
    }
    return `${num2Chars(date.getDate())}/${num2Chars(date.getMonth())}/${num2Chars(date.getFullYear())}`
}

export function dateToHHMMSS(date: Date) {
    return `${num2Chars(date.getHours())}:${num2Chars(date.getMinutes())}:${num2Chars(date.getSeconds())}`
}

function num2Chars(n: number) {
    if (typeof(n) !== 'number') return
    const s = n.toString();
    if (s.length === 2) return s
    if (s.length === 1) return `0${s}`
    return s.substring(s.length - 2)
}

export function dateToDateString(date: Date) {
    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`
}

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function colorIntToCss(color: number) {
    return `rgb(${color % (256 * 256 * 256) / (256 * 256)}, ${color % (256 * 256) / 256}, ${color % 256})`
}