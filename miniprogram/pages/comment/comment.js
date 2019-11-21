// pages/comment/comment.js
//创建数据库对象
const db=wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    content:"",           //保存用户评论信息
    score:0,             //评分
    movieid: 1292001,    //电影id 30362186 
    detail:{},           //js对象当前电影信息
    images:[],           //选中图片(预览时图片)
    fileIds:[]           //上传图片的id
  },
  comment:function(){
    //0:判断如果当前用户没有选择图片(可选)
    if (this.data.images.length==0){
    //1:提示请先选择图片
    wx.showToast({
      title:'请选择图片'
    })
    //2:停止函数执行
      return;
    }
  
    //功能：
    //(1)获取用户评论信息
    //(2)上传多张图片
    //(3)将用户评论信息与图片fileID保存云数据库
    // 1：在云数据中创建集合 comment 用户评论信息
    // 2：在添加属性fileIds:[] 上传文件id
    // 3：显示数据库加载提示框
    wx.showLoading({
      title: '评论正发表中...',
    })
    // 4：创建数组rows 保存promise对象
    var rows=[];
    // 5：创建循环遍历每张选中图片
    for(var i=0;i<this.data.images.length;i++){
    // 6：为每张创建Promise对象完成上传一张
    rows.push(new Promise((resolve,reject)=>{
      // 6.1:获取当前图片名称
      var item=this.data.images[i];
      // 6.2:获取后缀(拆分/搜索/正则表达式)
      //123.jpg .jpg=> exec()=>[.png]
      var suffix=/\.\w+$/.exec(item)[0];
      // 6.3:创建新文件名 时间+随机数
      var newFile=new Date().getTime();
      newFile+=Math.floor(Math.random()*9999);
      newFile+=suffix; 
      // 6.4:上传一张图片
      wx.cloud.uploadFile({
        cloudPath:newFile,//新文件名
        filePath:item,    //原文件名
        success:(res=>{
        // 6.5:在data属性添加数组fileIds文件id
        // 6.6:上传成功fileID保存
          var fid = res.fileID;
          this.data.fileIds.push(fid);
        // 6.7:上传成功后执行 解析
          resolve();
        })
      })
    
    }));//push end
    }// for end
    //功能三：将用户评论信息与图片fileID保存云数据库
    // 1:创建数据库对象
    //1.1:等待所有Promise执行完成之后
    //    才执行如下代码
    Promise.all(rows).then(res=>{
    // 2:获取用户评论内容
      var content=this.data.content;
    // 3:获取用户评分
      var score=this.data.score;
    // 4:当前电影id
      var id=this.data.movieid;
    // 5:图片fileIds
      var list=this.data.fileIds;
    // 6：*添加集合comment
       db.collection("comment").add({
         data:{
           content:content,//评论内容
           score:score,    //评论分数
           movieid:id,     //电影id
           fileIds:list    //图片fileID
         }
       }).then(res=>{
          // 7:添加成功 隐藏加载提示框
          wx.hideLoading();
          // 8:提示评论成功 
          wx.showToast({
            title:'发表成功'
          })
       }).catch(err=>{

       })
    
   
    })
  },
  uploadFile:function(){
    //功能：选中图片并且实现预览图片
    // 1:在data声明属性images  预览图片
    // 2:选中最多9张图片
    // 3:图片类型 原图 压缩图
    // 4:图片来源 相册 相机
    // 5:选中成功
    wx.chooseImage({
      count:9,  //9张图片
      sizeType:["original","compressed"],
      sourceType:["album","camera"],
      success: (res)=> {//选中成功
      // 6:获取选中图片路径
      var list =res.tempFilePaths;//临时路径
      //  console.log(list);
      // 7:保存data中images属性
      this.setData({
         images:list
      })
      },
    })
 
  
    // 8:在模板中显示选中图片列表
  },
  onContentChange: function (event) {
    //当用户输入内容在文本框触发事件
    //console.log(event.detail);
    this.setData({
       content:event.detail
      })
  },
  onChangeScore:function(event){
     //功能：获取当前用户评论
     //  console.log(event.detail);
    this.setData({
       score:event.detail
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.id);
    this.setData({
      movieid: options.id
    });
   this.loadMore();
    
  },
   loadMore:function(){
    //功能：组件创建成功后调用云函数
    //1:获取用户选中电影id
     var id = this.data.movieid;
    //2:显示数据加载提示框
    wx.showLoading({
      title: '正在加载中',
    })
    //3.调用云函数 findDetail1906 id
     wx.cloud.callFunction({
       name:"findDetail1906",
       data:{id:id}
    }).then(res=>{
      // console.log(res);
     //4.获取云函数返回数据
     var obj=JSON.parse(res.result);
     //5.保存 detail:{}
     this.setData({
       detail:obj
     })
     //6.隐藏加载提示框
     wx.hideLoading();
    }).catch(err=>{
      console.log(err);
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})