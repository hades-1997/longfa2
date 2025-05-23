import express from 'express';
import { engine } from 'express-handlebars';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import route from './routers/index.js';
import db from './config/db/index.js';
import methodOverride from 'method-override';


//connect db

db.connect();

const app = express();
const port = 3000;

//config url dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// config url folder public
app.use(express.static(path.join(__dirname, 'public')));
// HTP logger
app.use(morgan('combined'));

app.engine(
  '.hbs',
  engine({
    extname: '.hbs',
    helpers: {
      sum : (a , b) => a + b,
    }
  }),
);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'resources/views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
//config route init
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
