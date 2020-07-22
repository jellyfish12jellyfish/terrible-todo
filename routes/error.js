module.exports = function (req, res, next) {
    res.status(404).render('not-found-404', {
        title: 'Страница не найдена',
        is404: true
    });
};