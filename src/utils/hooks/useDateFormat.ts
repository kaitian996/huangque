/**
 *
 * @param format 格式化字符串
 * @example 'yyyy-MM-dd HH:mm:ss'
 * @param date Date对象
 * @returns  解析好的时间字符串
 */
export const useDateFormat = (format: string = "yyyy-MM-dd HH:mm:ss", date: Date = new Date()) => {
	if (date.toString() === "Invalid Date") {
		console.error("dateStr参数异常", date);
		return "-";
	}
	const year = date.getFullYear() + "";
	const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
	const day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
	const hour = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
	const minute = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
	const second = date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds();
	const millisecond = date.getMilliseconds();

	return (
		format
			.replace("yyyy", year + "")
			.replace("MM", month + "")
			.replace("dd", day + "")
			.replace("HH", hour + "")
			.replace("mm", minute + "")
			.replace("ss", second + "")
			.replace("WW", millisecond.toString().slice(0, 2)) || ""
	);
};
