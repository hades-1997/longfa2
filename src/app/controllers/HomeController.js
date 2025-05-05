class HomeController {
    index(req, res) {
        res.render('home');
    }

    show(req, res) {
        res.send('Home Detail');
    }
}

export default new HomeController();