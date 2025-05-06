import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const KeyActive = new Schema({
  name:  { type: String, maxLength: 600 },
  window_version: { type: String, maxLength: 600 },
  key_window: { type: String, maxLength: 600 },
  office_version: { type: String, maxLength: 600 },
  key_office: { type: String, maxLength: 600 },
  office_link: { type: String, maxLength: 600 },
  username: { type: String, maxLength: 600 },
  password: { type: String, maxLength: 600 },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now }
});

const KeyModel = mongoose.model('KeyActive', KeyActive);
export default KeyModel;
