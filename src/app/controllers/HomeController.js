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

    show(req, res) {
        res.send('Home Detail');
    }
}

export default new HomeController();