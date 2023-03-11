/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play  pause / seek
 * 4. CD rotate
 * 5. Next/ previous
 * 6. Random
 * 7. Next/ Repeat wwhen ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const timeCurrent = $('.time-current');
const timeDuration = $('.time-duration');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    playedSongs: [0],
    songs: [
        {
            name: 'Take Me To Church',
            singer: 'Hozier',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg',
        },
        {
            name: 'Anh Tự Do Nhưng Cô Đơn',
            singer: 'Đạt G',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Sợ Ngày Mai Em Đi Mất',
            singer: 'Đạt G',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Như Những Phút Ban Đầu',
            singer: 'Hoài Lâm',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'Hoa Nở Không Màu',
            singer: 'Hoài Lâm',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: 'Nếu Ngày Ấy',
            singer: 'Soobin Hoàng Sơn',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg'
        },
        {
            name: 'Suýt Nữa Thì',
            singer: 'Andiez',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            name: 'Chỉ Là Không Cùng Nhau',
            singer: 'Tăng Phúc',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg'
        },
        {
            name: 'Chạm Khẽ Tim Anh Một Chút Thôi',
            singer: 'Noo Phước Thịnh',
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.jpg'
        },
        {
            name: 'Người Đi Ngoài Phố',
            singer: 'Đàm Vĩnh Hưng',
            path: './assets/music/song10.mp3',
            image: './assets/img/song10.jpg'
        },
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song id-${index} ${index === 0? 'active' : ''}">
                    <div class="thumb"
                            style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('')
    },

    formatTime: function (totalSeconds) {
        hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        minutes = Math.floor(totalSeconds / 60);
        seconds = Math.floor(totalSeconds % 60);
        return (hours > 0 ? hours + ':' : '') + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds).toString();
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function () {
        const _this = this;

        // Xử lý CD quay

        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, // 10 second
            iterations: Infinity
        })

        cdThumbAnimate.pause();

        //xử lý phóng to thu nhỏ
        const cdWidth = cd.offsetWidth;
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // Khi song được play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
            
        }

        // Khi song đang được play
        audio.onplaying = function () {
            timeDuration.textContent = _this.formatTime(audio.duration);
        };

        // Khi song bị pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Khi tiến độ của bài hát thay đổi
        audio.ontimeupdate = function () {
            const currentTime = audio.currentTime;
            timeCurrent.textContent = _this.formatTime(currentTime);
            const duration = audio.duration;
            const percent = currentTime / duration * 100;
            progress.value = percent;

        }

        // Xử lý khi tua song 
        progress.oninput = function (e) {
            const seekTime = e.target.value / 100 * audio.duration;
            audio.currentTime = seekTime;
            timeCurrent.textContent = _this.formatTime(audio.currentTime);
        }

        // Khi next song
        nextBtn.onclick = function () {
            
            $('.song.id-' + _this.currentIndex + '.active').classList.remove('active');
            if(_this.isRandom) {
                _this.getRandomSong();
            } else {
                _this.getNextSong();
            }
            $('.song.id-' + _this.currentIndex).classList.add('active');
            audio.play();
            _this.scrollToActiveSong();
        }
        // Khi prev song
        prevBtn.onclick = function () {
            $('.song.id-' + _this.currentIndex + '.active').classList.remove('active');
            if(_this.isRandom) {
                _this.getRandomSong();
            } else {
                _this.getPrevSong();
            }
            $('.song.id-' + _this.currentIndex).classList.add('active');
            audio.play();
            _this.scrollToActiveSong();
        }

        //Xử lý bật / tắt random song
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom; 
           randomBtn.classList.toggle('active', _this.isRandom);
        }

        // Xử lý khi bật / tắt repeat song 
        repeatBtn.onclick = function () {
            _this.isRepeat =!_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
             audio.loop = _this.isRepeat;
        }

         // Xử lý next song khi xong bài
         audio.onended = function() {
            nextBtn.click();
        }
    },

    getNextSong: function () {
        this.currentIndex++;
        if(this.currentIndex > this.songs.length - 1) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    getPrevSong: function () {
        this.currentIndex--;
        if(this.currentIndex <= 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    getRandomSong: function() {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * this.songs.length);
        } while (randomIndex === this.currentIndex || this.playedSongs.includes(randomIndex)) 
        
        this.currentIndex = randomIndex;
        this.loadCurrentSong();
        
        // Xử lý các bài hát đã được phát 
        this.playedSongs.push(this.currentIndex);
        if(this.playedSongs.length === this.songs.length){
            this.playedSongs = [];
        }
    },
    scrollToActiveSong: function(){
        const songActive = $('.song.id-' + this.currentIndex + '.active');
        songActive.scrollIntoView({
            behavior:'smooth',
            block: 'nearest',
        });
    },
    loadCurrentSong: function() {

        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },

    start: function () {
        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents();

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // Render playlist
        this.render();
    }

}
app.start();