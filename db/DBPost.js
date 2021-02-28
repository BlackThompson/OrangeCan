var util = require('../util/util.js')

class DBPost {
  constructor(postId) {
    this.storageKeyName = 'postList';
    this.postId = postId;
  }

  //获取指定id号的文章数据
  getPostItemById() {
    var postsData = this.getAllPostData();
    var len = postsData.length;
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

  //收藏文章
  collect() {
    return this.updatePostData('collect');
  }

  //更新本地的点赞、评论信息、收藏、阅读量
  updatePostData(category) {
    var itemData = this.getPostItemById(),
      postData = itemData.data,
      allPostData = this.getAllPostData();
    switch (category) {
      case 'collect':
        //处理收藏
        if (!postData.collectionStatus) {
          //if uncollected
          postData.collectionNum++;
          postData.collectionStatus = true;
        } else {
          //if collected
          postData.collectionNum--;
          postData.collectionStatus = false;
        }
        break;
      case 'up':
        if (!postData.upStatus) {
          postData.upNum++;
          postData.upStatus = true;
        } else {
          postData.upNum--;
          postData.upStatus = false;
        }
        break;
      default:
        break;
    }
    //Update the cache database
    allPostData[itemData.index] = postData;
    this.execSetStorageSync(allPostData);
    return postData;
  }

  //like or unlike
  up() {
    var data = this.updatePostData('up');
    return data;
  }

  //Get the comment data for the article
  getCommentData() {
    var itemData = this.getPostItemById().data;
    //Sort in descending time order
    itemData.comments.sort(this.compareWithTime);
    var len = itemData.comments.length,
      comment;
    for (var i = 0; i < len; i++) {
      //将comment中的时间戳转换为可阅读格式
      comment = itemData.comments[i];
      comment.create_time = util.getDiffTime(comment.create_time, true);
    }
    return itemData.comments;
  }

  compareWithTime(value1, value2) {
    var flag = parseFloat(value1.creat_time) - parseFloat(value2.creat_time);
    if (flag < 0) {
      return 1;
    } else if (flag > 0) {
      return -1
    } else {
      return 0;
    }
  }

};



export {
  DBPost
}