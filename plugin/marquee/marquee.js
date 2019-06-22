//autoMove() -> move() -> changeStyle() -> slider()
//定时器到了  -> 改变index -> 改变索引样式 -> 滑动轮播

/**
 * 轮播图jquery插件说明
 *
 * 要求将被渲染为轮播图的div的id名为marquee
 * 调用方式为$('#marquee').marquee(imgs);
 * 其中imgs是图片数组，每一个数组元素为图片的路径名
 * 样式需引入marquee.css, 默认图片大小为520*280px, 若图片大小不同请自行修改
 */
(function($) {
    var Marquee = function(el, options) {
        this.$el = el;
        this.currentIndex = 0;
        // 合并配置
        this.options = $.extend({}, Marquee.DEFAULTS, options);
        this.init();
    };
    // 设置默认数据
    Marquee.DEFAULTS = {
        speed: 1700,
        // 默认自动播放
        autoplay: true,
        // 默认展示分页
        paginationer: true,
        // 默认展示前进后退按钮
        navigation: true
    };
    Marquee.prototype.init = function() {
        // 初始化页面
        this.renderDome();
        // 初始化事件
        this.bindEvents();
        // 
        this.autoMove();
    };
    // 初始化事件
    Marquee.prototype.bindEvents = function() {
        var _this = this;
        $('#marquee').on('click', '.pagination li', function() {
            // 停止自动轮播
            clearTimeout(_this.timer);
            // 防止重复点击
            if (_this.flag) {
                return false
            }
            _this.move($(this).index())
        })
    };
    // 执行动画
    Marquee.prototype.move = function(idx) {
        var _this = this;
        _this.flag = true;
        // 获取index值
        _this.currentIndex = idx;
        if (idx == _this.timeLen) {
            $('.pagination li').eq(0).addClass('active').siblings().removeClass('active');
            var animateWidth = idx * _this.baseWdith;
            _this.$el.find('.marquee-wrapper').animate({ left: -animateWidth + 'px' }, _this.options.speed, function() {
                _this.flag = false;
                _this.$el.find('.marquee-wrapper').css({ 'left': 0 });
            });
            _this.currentIndex = 0;
        } else {
            // 移动的长度
            var animateWidth = idx * _this.baseWdith;
            $('.pagination li').eq(idx).addClass('active').siblings().removeClass('active');
            _this.$el.find('.marquee-wrapper').animate({ left: -animateWidth + 'px' }, _this.options.speed, function() {
                _this.flag = false
            });
        }
        _this.autoMove();
    };
    // 
    Marquee.prototype.autoMove = function() {
        var _this = this;
        // 防止重复点击
        if (_this.flag) {
            return false
        }
        clearTimeout(this.timer);
        _this.timer = setTimeout(function() {
            _this.move(++_this.currentIndex);
        }, _this.options.speed);
    };
    // 初始化页面
    Marquee.prototype.renderDome = function() {
        // 滚动元素个数
        this.timeLen = this.$el.find('.marquee-wrapper li').length;
        // 复制第一个元素用于无缝滚动
        this.$el.find('.marquee-wrapper li').eq(0).clone().appendTo('.marquee-wrapper');
        // 计算容器的宽度
        this.baseWdith = this.$el.width();
        // 子容器宽度赋值
        this.$el.find('.marquee-wrapper').width(this.baseWdith * (this.timeLen + 1));
        // 分页渲染
        if (this.options.paginationer) {
            var paginaStr = '<div class="pagination">';
            for (var i = 0; i < this.timeLen; i++) {
                if (i === 0) {
                    paginaStr += '<li class="active"></li>'
                    continue;
                }
                paginaStr += '<li></li>';
            }
            paginaStr += '</div>';
            this.$el.append(paginaStr);
        };
        // 前进后退按钮
        if (this.options.navigation) {
            var navigaStr = '<div class="prev">&lt;</div><div class="next">&gt;</div>';
            this.$el.append(navigaStr);
        }
    };
    //添加自定义jq插件
    $.fn.extend({
        marquee: function(options) {
            new Marquee($(this), options);
        }
    })
})(jQuery)