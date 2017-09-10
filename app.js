var express    = require('express');
var app        = express();
var path       = require('path');
var bodyParser = require('body-parser');
var sass       = require('node-sass-middleware');
var port       = process.env.PORT || 1780;

//views中ejs檔案的路徑設定
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'ejs');

//sass 的設定
app.use('/css', sass({
    src: path.join(__dirname, 'public/sass'), //scss 檔案的位置
    dest: path.join(__dirname, 'public/css'), //輸出的位置
    debug: true,
    outputStlyes: 'expanded'
}));

//靜態檔案和middleware的路徑設定
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//roters 的設定
app.get('/', function(req, res){
	res.render('index');
});

app.listen(port);