import KeyModel from '../models/KeyActive.js';
import mongooseHelpers from '../../util/mongoose.js';
import XLSX from 'xlsx';

class HomeController {
    async index(req, res, next) {
        await KeyModel.find({}).then(keyactives => {
            res.render('home/index', {
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
        keyActive.save()
            .then(() => res.redirect(`/`))
            .catch((error) => {});
    }

    // [GET] :id/edit
    async edit(req, res, next) {
        await KeyModel.findById(req.params.id).then(
            keyactive => res.render('home/edit', {
                keyactive: mongooseHelpers.mongooseToObject(keyactive)
            })
        ).catch(next);
    }

    //  [PUT] /:id?_method=PUT
    async update(req, res, next) {
        await KeyModel.updateOne({_id : req.params.id}, req.body)
            .then(() => res.redirect('back'))
            .catch((error) => {});
    }


     // [DELETE] /:id
    async destroy(req, res, next) {
        console.log('done')
        await KeyModel.deleteOne({_id : req.params.id})
                .then(() => res.redirect('back'))
                .catch((error) => {});
    }

    // [GET] home/import
    async importForm(req, res) {
        res.render('home/import', {
            error: null,
            success: null
        });
    }

    // [POST] home/import
    async importExcel(req, res, next) {
        try {
            if (!req.file) {
                return res.render('home/import', {
                    error: 'Vui lòng chọn file Excel để import',
                    success: null
                });
            }

            const workbook = XLSX.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);

            if (data.length === 0) {
                return res.render('home/import', {
                    error: 'File Excel không có dữ liệu',
                    success: null
                });
            }

            // Validate data
            const validData = data.filter(item => item.name);
            if (validData.length === 0) {
                return res.render('home/import', {
                    error: 'Không có dữ liệu hợp lệ trong file Excel',
                    success: null
                });
            }

            // Insert data to database
            await KeyModel.insertMany(validData);
            
            req.flash('success', `Import thành công ${validData.length} bản ghi`);
            res.redirect('/');
        } catch (error) {
            res.render('home/import', {
                error: 'Có lỗi xảy ra khi import file Excel. Vui lòng kiểm tra lại định dạng file',
                success: null
            });
        }
    }
}

export default new HomeController();