const toDate = date => {
    return new Intl.DateTimeFormat('ru', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
};

document.querySelectorAll('.toDate').forEach(i => {
    i.textContent = toDate(i.textContent);
});