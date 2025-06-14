export type TEmailProp = {
    email: string | null;
}

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        weekday: 'short',
        day: 'numeric',
        month: 'long'
    });
};

export const getLessonTime = (lessonNumber: number) => {
    const times = [
        "8:00-9:30", "9:40-11:10", "11:20-12:50",
        "13:30-15:00", "15:10-16:40", "16:50-18:20"
    ];
    return times[lessonNumber - 1] || '';
};