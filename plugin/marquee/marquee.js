/**
 * 轮播图jquery插件说明
 *
 * 固定结构
 * <div id="marquee" class="anyName">
        <div class="marquee-wrapper">
            <div class="marquee-item"></div>
            <div class="marquee-item"></div>
            <div class="marquee-item"></div>
        </div>
    </div>
 * 调用方式为$('#marquee').marquee() \ $('.anyName).marquee(options);
 * 配置: options 必须是对象
 * delay: 延迟时间 默认 700ms
 * speed: 滑动速度 默认 1700ms
 * autoplay: 是否自动播放 默认 true
 * paginationer: 是否展示分页 默认 true
 * navigation: 是否展示前进后退按钮 true
 * 样式需引入marquee.css
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
        this.autoMove();
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
            _this.transiter();
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
            _this.transiter();
        }).on('click', '.prev', function() { // 上一页
            // 防止重复点击
            if (_this.flag) {
                return false
            };
            _this.currentIndex -= 1;
            _this.transiter();
        })
    };
    // 
    Marquee.prototype.transiter = function() {
        var _this = this;
        // 停止自动轮播
        _this.options.autoplay = false
        clearTimeout(_this.timer);
        clearTimeout(_this.timeStop);
        // 停止点击 3 s 后自动轮播
        _this.timeStop = setTimeout(function() {
            _this.options.autoplay = true;
            _this.autoMove();
        }, _this.options.speed + 3000);
        _this.move();
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
        _this.autoMove();
    };
    // 
    Marquee.prototype.autoMove = function() {
        if (!this.options.autoplay) {
            return false
        }
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
            if (options !== undefined && !$.isPlainObject(options)) {
                throw '参数必须为对象';
            }
            new Marquee($(this), options);
        }
    })
})(jQuery)