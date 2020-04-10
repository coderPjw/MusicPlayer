/* 
  请求地址： https://autumnfish.cn/search
  请求方法：get
  请求参数：keywords
  响应内容：歌曲搜索结果
*/

/* 
  歌曲请求地址： https://autumnfish.cn/song/url
  歌曲详情地址： https://autumnfish.cn/song/detail
  歌曲评论获取： https://autumnfish.cn/comment/hot?type=0
*/

const app = new Vue({
  el: '#app',
  data() {
    return {
      query: '一直很安静',
      musicList: [],
      musicUrl: '',
      musicPic: '',
      comments: [],
      angle: 0,
      flag: false
    }
  },
  methods: {
    searchSongs() {
      // 发送查找歌曲的请求
      axios.get('https://autumnfish.cn/search?keywords=' + this.query)
        .then(res => {
          this.musicList = res.data.result.songs
        })
        .catch(err => {
          console.log(err);
        })
    },
    playMusic(id) {
      // 当重新请求了音乐的时候，重置图片旋转角度
      // 但是当切换歌曲的时候，播放器并没有停止，而是持续播放，需要先手动停止播放一次
      this.angle = 0
      this.flag = false
      const pic = document.querySelector('.musicPic-container')
      pic.style.transform = "rotateZ(" + this.angle + "deg)"

      // 音乐请求
      axios.get('https://autumnfish.cn/song/url?id=' + id)
        .then(res => {
          this.musicUrl = res.data.data[0].url
        })
        .catch(err => {
          console.log(err);
        })
      // 音乐图片请求
      axios.get('https://autumnfish.cn/song/detail?ids=' + id)
        .then(res => {
          this.musicPic = res.data.songs[0].al.picUrl
        })
      // 热门评论请求
      axios.get('https://autumnfish.cn/comment/hot?type=0&id=' + id)
        .then(res => {
          this.comments = res.data.hotComments
        })
    },
    play() {
      this.flag = true
    },
    pause() {
      this.flag = false
      // 保存当前旋转角度
      this.angle = getRotate()
      const pic = document.querySelector('.musicPic-container')
      pic.style.transform = "rotateZ(" + this.angle + "deg)"
    }
  },
  created() {
    this.searchSongs()
  }
})