var Post = require('./db').Post								// 单独测试时用
// var Post = require('../proxy').Post
var mongoose = require('mongoose')
var Schema = mongoose.Schema


// Post
//   .find({ name: 'liu' })
//   .sort('-date')
//   .skip((1 - 1) * 2)
//   .limit(2)
//   .exec(function (err,docs) {
//   	  console.log(docs)
//   });

// Post.count({name: 'liu'}, function (err, docs) {
// 	console.log(docs)
// })

// Post.distinct('tags', function (err, result) {
// 	console.log(result)
// })

Post.find({ tags: '1' }, { 'name', '_id', 'title' }, { sort: '-date' },function (err, docs) {
	console.log(docs)
})