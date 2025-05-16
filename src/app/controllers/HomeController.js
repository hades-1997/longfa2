import KeyModel from '../models/KeyActive.js';
import mongooseHelpers from '../../util/mongoose.js';
import XLSX from 'xlsx';
import fs from 'fs';
import slugify from 'slugify';

class HomeController {
    async index(req, res, next) {
        await KeyModel.find({}).then(keyactives => {
            res.render('home/index', {
                keyactives: mongooseHelpers.mutipleMongooseToObject(keyactives)
            })
        }).catch(error => next(error));
    }
    
    // [GET] search
    async search(req, res, next) {
        const keyword = req.query.q;
        await KeyModel.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { key_window: { $regex: keyword, $options: 'i' } },
                { key_office: { $regex: keyword, $options: 'i' } },
                { window_version: { $regex: keyword, $options: 'i' } },
                { office_version: { $regex: keyword, $options: 'i' } },
            ]
        }).then(keyactives => {
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
            // 1. Kiểm tra file
            if (!req.file) {
              return res.render('home/import', {
                error: 'Vui lòng chọn file Excel để import',
                success: null
              });
            }
        
            // 2. Đọc file Excel
            const filePath = req.file.path;
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
        
            // 3. Chuyển thành mảng 2 chiều
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            data.shift(); // bỏ tiêu đề

            // 4. Chuyển thành danh sách object hợp lệ

            const validData = data.map((row, index) => ({
                name: row[0]?.toString().trim() || null,
                window_version: row[1]?.toString().trim() || null,
                key_window: row[2]?.toString().trim() || null,
                office_version: row[3]?.toString().trim() || null,
                key_office: row[4]?.toString().trim() || null,
                office_link: row[5]?.toString().trim() || null,
                username: row[6]?.toString().trim() || null,  
                password: row[7]?.toString().trim() || null, 
                slug: row[0] ? slugify(row[0], { lower: true }) : `name-${index}`
            })).filter(item => item.name && item.slug); // Lọc các dòng không hợp lệ
    

            if (validData.length === 0) {
              return res.render('home/import', {
                error: 'Không có dữ liệu hợp lệ trong file Excel',
                success: null
              });
            }
            
            console.log(validData)
            // 5. Lưu vào database
            await KeyModel.insertMany(validData);
        
            // 6. Xóa file sau khi dùng
            // fs.unlink(filePath, (err) => {
            //   if (err) console.error('Lỗi khi xóa file:', err);
            // });
        
            // 7. Chuyển hướng sau thành công
            // req.flash('success', `Import thành công ${validData.length} bản ghi`);
            res.redirect('/');
        
          } catch (error) {
            console.error('Lỗi import Excel:', error);
            res.render('home/import', {
              error: 'Có lỗi xảy ra khi import file Excel. Vui lòng kiểm tra lại định dạng file',
              success: null
            });
          }
    }

    async handleFormActions(req, res, next) {
        switch(req.body.action) {
            case "delete":
                await KeyModel.deleteOne({_id : {$in: req.body.keyIds}})
                .then(() => res.redirect('/'))
                .catch((error) => {next});
                break;
            default :
                res.json({Message: "Action Invalid"})    
        }

    }
}

export default new HomeController();