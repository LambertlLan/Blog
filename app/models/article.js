// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: { type:String, required:true },
  content:{ type:String, required:true },
  slug:{ type:String, required:true },
  category:{ type:Schema.Types.ObjectId, ref:'Category' },
  author:{ type:Schema.Types.ObjectId, ref:'User' },
  published:{ type:Boolean, default:true },
  imgUrl:{type:String},
  meta:{ type:Schema.Types.Mixed },
  comments:{ type:Schema.Types.Mixed },
  created:{ type:Date },
});

mongoose.model('Article', ArticleSchema);

