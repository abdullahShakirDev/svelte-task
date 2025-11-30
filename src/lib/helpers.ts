export const formatDate = (date: Date) => {
	return new Intl.DateTimeFormat('en-ZA').format(date);
};
