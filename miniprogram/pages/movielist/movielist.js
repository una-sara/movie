// pages/movielist/movielist.js
//0:创建数据库对象
const db=wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]//
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  1:调用云数据库 mymovie
    db.collection("mymovie")//指定集合
    .get()        //查询
    .then(res=>{//查询成功
      console.log(res);//两条
      this.setData({
        list: res.data //保存数据
      })
    }).catch(err=>{
      console.log(err); 
    })
    //  2:获取返回数据
    //  3：显示列表
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