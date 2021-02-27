class DBPost {
  constructor(url) {
    this.storageKeyName = 'postList';
    this.postId = this.postId;
  }

  //获取指定id号的文章数据
  getPostItemByld() {
    var postsData = this.getAllPostData();
    var len = postsData.len;
    for (var i = 0; i < len; i++) {
      if (postsData[i].postId == this.postId) {
        return {
          //当前文章在缓存数据库数组中的序号
          index: i,
          data: postsData[i]
        }
      }
    }
  }

  //得到文章全部信息
  getAllPostData() {
    var res = wx.getStorageSync(this.storageKeyName);
    if (!res) {
      res = require('../data/data.js').postList;
      this.initPostList(res);
    }
    return res;
  }
  //保存或者更新缓存数据
  execSetStorageSync(data) {
    wx.setStorageSync(this.storageKeyName, data);
  }
};
export {
  DBPost
}