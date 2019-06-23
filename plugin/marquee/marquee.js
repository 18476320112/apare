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
        this.currentIndex = 1;
        // 合并配置
        this.options = $.extend({}, Marquee.DEFAULTS, options);
        this.init();
    };
    // 设置默认数据
    Marquee.DEFAULTS = {
        // 延迟时间
        delay: 700,
        // 滑动速度
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
        // this.autoMove();
    };
    // 初始化事件
    Marquee.prototype.bindEvents = function() {
        var _this = this;
        // 点击分页
        _this.$el.on('click', '.pagination li', function() {
            // 停止自动轮播
            clearTimeout(_this.timer);
            // 防止重复点击
            if (_this.flag) {
                return false
            };
            _this.currentIndex = $(this).index() + 1;
            _this.move();
        }).on('mouseenter', function() {
            $('.prev').show();
            $('.next').show();
        }).on('mouseleave', function() {
            $('.prev').hide();
            $('.next').hide();
        }).on('click', '.next', function() { // 下一页 
            // 防止重复点击
            if (_this.flag) {
                return false
            };
            _this.currentIndex += 1;
            _this.move();
        }).on('click', '.prev', function() { // 上一页
            // 防止重复点击
            if (_this.flag) {
                return false
            };
            _this.currentIndex -= 1;
            _this.move();
        })
    };
    // 执行动画
    Marquee.prototype.move = function() {
        var _this = this;
        _this.flag = true;
        // 移动的长度
        var animateWidth = _this.currentIndex * _this.baseWdith;
        clearTimeout(_this.timerSub);
        // 分页延迟
        _this.timerSub = setTimeout(function() {
            if (_this.currentIndex === _this.timeLen) { // 是否为最后一页
                $('.pagination li').eq(0).addClass('active').siblings().removeClass('active');
            } else { // 是否为第一页
                $('.pagination li').eq(_this.currentIndex - 1).addClass('active').siblings().removeClass('active');
            }
        }, _this.options.speed / 2);

        _this.$el.find('.marquee-wrapper').animate({ left: -animateWidth + 'px' }, _this.options.speed, function() {
            _this.flag = false;
            if (_this.currentIndex === _this.timeLen) { // 是否为最后一页
                _this.$el.find('.marquee-wrapper').css({ 'left': -_this.baseWdith * 1 + 'px' });
                _this.currentIndex = 1;
            } else if (_this.currentIndex === 0) { // 是否为第一页
                _this.$el.find('.marquee-wrapper').css({ 'left': -_this.baseWdith * (_this.timeLen - 1) + 'px' });
                _this.currentIndex = _this.timeLen - 1;
            }
        });
    };
    // 
    Marquee.prototype.autoMove = function() {
        var _this = this;
        clearTimeout(this.timer);
        _this.timer = setTimeout(function() {
            _this.move(++_this.currentIndex);
        }, _this.options.speed + _this.options.delay);
    };
    // 初始化页面
    Marquee.prototype.renderDome = function() {
        // 滚动元素个数
        this.timeLen = this.$el.find('.marquee-item').length + 1;
        // 复制第一个和最后一个元素用于无缝滚动
        this.$el.find('.marquee-item').eq(0).clone().appendTo('.marquee-wrapper');
        this.$el.find('.marquee-item').eq(this.timeLen - 2).clone().prependTo('.marquee-wrapper');
        // 计算容器的宽度
        this.baseWdith = this.$el.width();
        // 子容器宽度赋值
        this.$el.find('.marquee-wrapper').width(this.baseWdith * (this.timeLen + 1)).css({ 'left': -this.baseWdith + 'px' });
        // 分页渲染
        if (this.options.paginationer) {
            var paginaStr = '<div class="pagination">';
            for (var i = 0; i < this.timeLen - 1; i++) {
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