const relativeTimeFormat = new Intl.RelativeTimeFormat()

export function relativeTime(date: Date): string {
	const diff = Math.floor((new Date().getTime() - date.getTime()) / 1000)
	const intervals = [
		{ label: "year", seconds: 31536000 },
		{ label: "month", seconds: 2592000 },
		{ label: "week", seconds: 604800 },
		{ label: "day", seconds: 86400 },
		{ label: "hour", seconds: 3600 },
		{ label: "minute", seconds: 60 },
		{ label: "second", seconds: 1 }
	] as const

	for (const { label, seconds } of intervals) {
		const interval = Math.floor(diff / seconds)

		if (interval >= 1) {
			return relativeTimeFormat.format(-interval, label)
		}
	}

	return relativeTimeFormat.format(0, "second")
}