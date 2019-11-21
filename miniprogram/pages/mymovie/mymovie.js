// pages/mymovie/mymovie.js
//创建数据库对象
const db=wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     moviename:"",//当前喜欢电影名称
     content:"", //填写喜欢原因
     images:[],  //保存选中图片列表
     fileIds:[]  //保存上传文件fileID
  }, 
  submit:function(){
    //提交：
    //功能一：将选中图片上传云存储
    //功能二：将用户信息fileid添加云数据库
    // 1：显示数据加载提示框
    wx.showLoading({
      title: '数据正在提交中...',
    })
    var rows=[];
    // 3：创建循环遍历选中图片列表
    for (var i = 0; i < this.data.images.length; i++) {
      //  4：创建Promise对象完成上传
      rows.push(new Promise((resolve, reject) => {
        // / 5：获取当前文件名
        var item = this.data.images[i];
        // 6:获取后缀(拆分/搜索/正则表达式)
        //123.jpg .jpg=> exec()=>[.png]
        var suffix = /\.\w+$/.exec(item)[0];
        // 7:创建新文件名 时间+随机数
        var newFile = new Date().getTime();
        newFile += Math.floor(Math.random() * 9999);
        newFile += suffix;
        // 8:上传一张图片
        wx.cloud.uploadFile({
          cloudPath: newFile,//新文件名
          filePath: item,    //原文件名
          success: (res => {
            // 9:在data属性添加数组fileIds文件id
            // 6.6:上传成功fileID保存
            var fid = res.fileID;
            this.data.fileIds.push(fid);
            // 10:上传成功后执行 解析
            resolve();
          })
        })

      }));//promise end
    }// end for
    //功能二:等待所有的Promise对象执行完成
    Promise.all(rows).then(res=>{
         // 11：获取当前留言
        var msg=this.data.content;
        // 12：当前电影名称
        var name=this.data.moviename;
      // 13：获取上传图片filesIds
      var fileid=this.data.fileIds;
      // 14：创建数据库对象
      // 15：云数据库控制台创建集合:mymovie
      db.collection("mymovie")
      // 16：向mymovie集合中添加一条记录
      .add({
        data:{
          msg:msg,
          name:name,
          fielid: fileid
        }
      }).then(res=>{
        // 17：添加成功
        // 18：隐藏加载提示框
        wx.hideLoading();
        // 19:显示短消息提示框 提交成功  
        wx.showToast({
          title:'提交成功'
        })
      })
     })
  },
  jumpDetail:function(){
    //功能：跳转我喜欢的电影列表组件
    wx.navigateTo({
      url: '/pages/movielist/movielist'
    })
    // 显示电影列表信息
    // 1:*创建新组件movielist
    // 2:查询云数据库 mymovielist
    // 3:*在当前对象data中添加属性 list
    // 4:将云数据库返回值保存list
    // 5:在模板页面显示电影列表
  },
  upload:function(){
    //功能：
    //1：选择多张图片
    //2：将图片显示在imageslist区域
    // 1：在data添加属性images:[]
    // 2：显示数据加载提示框
    wx.showLoading({
      title:'请选择图片...'
    })
    // 3：选择多张图片 9
    // 4：图片来源
    // 5：图片类型
    // 6：选择成功
    wx.chooseImage({
      count:9,    //一次可以选中多张图片
      sizeType:["original","compressed"],
      sourceType:["album","camera"],
      success: (res) =>{//选中成功
      var list=res.tempFilePaths;
        // 7：将选中图片保存images
        this.setData({//保存images
          images:list
      });
       // 8：隐藏加载提示框
         wx.hideLoading();
      },
    })
  },
  onChangeContent: function (event) {
    //功能：当用户输入原因内容时触发事件
    this.setData({
      content: event.detail
    })
  },
  onChangeMname:function(event){
   //功能：修改电影名称
   this.setData({
     moviename:event.detail
   })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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