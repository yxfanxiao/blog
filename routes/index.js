var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../proxy').User;
var Post = require('../proxy').Post;
var moment = require('moment');
var markdown = require('markdown').markdown;
var	sign = require('../controllers/sign');
var post = require('../controllers/post');

/* GET home page. */
router.get('/', sign.index);

router.get('/reg', sign.showReg);
router.post('/reg', sign.reg);

router.get('/login', sign.showLogin);
router.post('/login', sign.login);

router.get('/post', post.showPost);
router.post('/post', post.post);
router.get('/logout', sign.logout);

router.get('/upload', post.showPostPic);
router.post('/upload', post.postPic);

router.get('/u/:name', function (req, res, next) {
	User.getUserByName(req.params.name, function (err, user) {
		// console.dir(user);
		if (!user) {
			req.flash('error', '用户不存在');
			return res.redirect('/');
		}
		Post.getPostByUser(user.name, function (err, docs) {
			if (err) {
				req.flash('error', err)
				return res.redirect('/');
			}
			var postDate = [];
			docs.forEach(function (post, index) {
				postDate[index] = moment(post.date).format('YYYY-MM-DD HH:mm:ss');	
				post.postContent = markdown.toHTML(post.postContent);		
			});
			// console.log(docs);
			res.render('user', {
				title: user.name,
				posts: docs,
				user: req.session.user,
				postDate: postDate,
				success: req.flash('success').toString(),
				error: req.flash('error').toString() 
			});
		});
	});
});
router.get('/u/:name/:article', function (req, res, next) {
	// console.log(req.params.article);
	Post.getPostById(req.params.article, function (err, post) {
		// console.log(post);
		if (!post) {
			req.flash('error', '文章不存在');
			return res.redirect('/');
		}
		// console.log('post');
		var postDate = moment(post.date).format('YYYY-MM-DD HH:mm:ss');
		res.render('article', {
			title: post.title,
			_id: req.params.article,
			name: post.name,
			postDate: postDate,
			postContent: markdown.toHTML(post.postContent),
			success: req.flash('success').toString(),
			error: req.flash('error').toString(),
			user: req.session.user			
		});
	});
});

router.get('/edit/:article', function (req, res, next) {
	var user = req.session.user;
	var post_id = req.params.article;
	Post.getPostById(post_id, function (err, post) {
		// console.log(post);
		if (!post) {
			req.flash('error', '文章不存在');
			return res.redirect('/');
		}
		// console.log('post');
		var postDate = moment(post.date).format('YYYY-MM-DD HH:mm:ss');
		res.render('edit', {
			title: post.title,
			_id: post_id,
			name: post.name,
			postDate: postDate,
			postContent: post.postContent,
			success: req.flash('success').toString(),
			error: req.flash('error').toString(),
			user: req.session.user			
		});
	});
});

router.post('/edit/:article', function (req, res, next) {
	var user = req.session.user;
	var post_id = req.params.article;
	var url = '/edit/' + post_id;
	Post.update(post_id, req.body.title, req.body.postContent, function (err, post) {
		if (err) {
			req.flash('err', err);
			return res.redirect(url);
		}
		req.flash('success', '修改成功！');
		res.redirect(url);
	});
});

router.get('/remove/:name/:article', function (req, res, next) {
	var user = req.session.user;
	if (user.name !== req.params.name) {
		req.flash('err', '请勿删除他人的文章！');
		return res.redirect('back');
	}
	var post_id = req.params.article;
	Post.removeById(post_id, function (err) {
		if (err) {
			req.flash('err', '删除失败！');
			return res.redirect('/');
		}
		req.flash('success', '删除成功！');
		res.redirect('/');
	});	
});

module.exports = router;
