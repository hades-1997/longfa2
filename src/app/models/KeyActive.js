import mongoose from 'mongoose';
import slugify from 'slugify';

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
  slug: { type: String, slug: 'name', unique: true }
}, {
  timestamps : true,
});

KeyActive.pre('save', function (next) {
  if (!this.slug) {
      this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const KeyModel = mongoose.model('KeyActive', KeyActive);
export default KeyModel;
