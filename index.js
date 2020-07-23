const express = require('express');
const mongoose = require('mongoose');
const csrf = require('csurf');
const flash = require('connect-flash');
const helmet = require('helmet');
const compression = require('compression');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const keys = require('./keys/index');
const path = require('path');
const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');
const addRoutes = require('./routes/add');
const todoRoutes = require('./routes/todo');
const contactRoutes = require('./routes/contact');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const fileMiddleware = require('./middleware/file');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
const rateLimit = require('express-rate-limit');
const errorHanlder = require('./routes/error');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});


const app = express();
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./utils/hbs-helpers'),
    handlebars: allowInsecurePrototypeAccess(Handlebars)
});

const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: keys.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store
}));

app.use(fileMiddleware.single('avatar'));

app.use("/auth", limiter);

app.use(csrf());
app.use(flash());
app.use(helmet());
app.use(compression());
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/add', addRoutes);
app.use('/todo', todoRoutes);
app.use('/contact', contactRoutes);

app.use(errorHanlder);

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        await mongoose.connect(
            keys.MONGODB_URI, {
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            });
        app.listen(PORT, () => {
            console.log(keys.BASE_URL);
        });
    } catch (e) {
        console.log(e);
    }
}

start();

/*
todo стилизация отсутствия тудушек
todo добавить время создания тудушки, поработать с классом Intl
todo запретить формам запоминать данные
todo создать стили для ошибок
todo сохранить данные в формах при выкидывании ошибок
todo 2: переверстать профиль, туду, "выберите файл", почту
todo 3: заняться с чарт.жс
todo возможно, стоит переписать некоторые вещи на аякс
todo bootstrap alerts for showing errors
todo верстка обновления todo
todo индикатор кол-ва тудушек с помощью прогресс-бара
todo массовое удаление тудушек
todo отправка имейл: после показать успешный алерт или ошибки, вернуться к форме с помощью якоря
todo создать страницу-статиску чарт жс, создать роуты для запросов в бд
 */
