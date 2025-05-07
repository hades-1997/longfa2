import KeyModel from '../models/KeyActive.js';
import mongooseHelpers from '../../util/mongoose.js';

class HomeController {
    async index(req, res, next) {
        await KeyModel.find({}).then(keyactives => {
            res.render('home', {
                keyactives: mongooseHelpers.mutipleMongooseToObject(keyactives)
            })
        }).catch(error => next(error));
    }

    // [GET] home/create
    create(req, res) {
        res.render('home/create');
    }

    // [POST] home/store
    store(req, res, next) {
        // res.json(req.body)
        const keyActive = new KeyModel(req.body);
        keyActive.save().then(() => res.redirect(`/`)).catch((error) => {});
    }

    show(req, res) {
        res.send('Home Detail');
    }
}

export default new HomeController();