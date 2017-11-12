//用户表user
//id 自增，username，psd
create table user 
	(
		username 
	)


//文章列表article
//id 自增，title,content,owner(用户id)



//新增用户
//默认添加
insert into user(username,psd) values($username,$psd);

//登录验证，
select * from user where username = $username and psd = $psd;

//获取文章列表
select * from article;

//新增文章
insert into article(title,content,owner) values ($title,$content,$owner); 

//删除文章
delete from article where id = $id;