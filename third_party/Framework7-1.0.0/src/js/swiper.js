/*===========================
Swiper
===========================*/
window.Swiper = function (container, params) {
    var defaults = {
        direction: 'horizontal',
        touchEventsTarget: 'container',
        initialSlide: 0,
        speed: 300,
        // autoplay
        autoplay: false,
        autoplayDisableOnInteraction: true,
        // Free mode
        freeMode: false,
        freeModeMomentum: true,
        freeModeMomentumRatio: 1,
        freeModeMomentumBounce: true,
        freeModeMomentumBounceRatio: 1,
        // Effects
        effect: 'slide', // 'slide' or 'fade' or 'cube' or 'coverflow'
        coverflow: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows : true
        },
        cube: {
            slideShadows: true,
            shadow: true,
            shadowOffset: 20,
            shadowScale: 0.94
        },
        // Scrollbar
        scrollbar: null,
        scrollbarHide: true,
        // Keyboard Mousewheel
        keyboardControl: false,
        mousewheelControl: false,
        mousewheelForceToAxis: false,
        // Hash Navigation
        hashnav: false,
        // Slides grid
        spaceBetween: 0,
        slidesPerView: 1,
        slidesPerColumn: 1,
        slidesPerColumnFill: 'column',
        slidesPerGroup: 1,
        centeredSlides: false,
        // Touches
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: true,
        shortSwipes: true,
        longSwipes: true,
        longSwipesRatio: 0.5,
        longSwipesMs: 300,
        followFinger: true,
        onlyExternal: false,
        threshold: 0,
        touchMoveStopPropagation: true,
        // Pagination
        pagination: null,
        paginationClickable: false,
        paginationHide: false,
        // Resistance
        resistance: true,
        resistanceRatio: 0.85,
        // Next/prev buttons
        nextButton: null,
        prevButton: null,
        // Progress
        watchSlidesProgress: false,
        watchVisibility: false,
        // Cursor
        grabCursor: false,
        // Clicks
        preventClicks: true,
        clicksStopPropagation: true,
        releaseFormElements: true,
        slideToClickedSlide: false,
        // Images
        updateOnImagesReady: true,
        // loop
        loop: false,
        loopAdditionalSlides: 0,
        loopedSlides: null,
        // Control
        control: undefined,
        controlInverse: false,
        // Swiping/no swiping
        allowSwipeToPrev: true,
        allowSwipeToNext: true,
        swipeHandler: null, //'.swipe-handler',
        noSwiping: true,
        noSwipingClass: 'swiper-no-swiping',
        // NS
        slideClass: 'swiper-slide',
        slideActiveClass: 'swiper-slide-active',
        slideVisibleClass: 'swiper-slide-visible',
        slideDuplicateClass: 'swiper-slide-duplicate',
        slideNextClass: 'swiper-slide-next',
        slidePrevClass: 'swiper-slide-prev',
        wrapperClass: 'swiper-wrapper',
        bulletClass: 'swiper-pagination-bullet',
        bulletActiveClass: 'swiper-pagination-bullet-active',
        buttonDisabledClass: 'swiper-button-disabled',
        paginationHiddenClass: 'swiper-pagination-hidden',
        // Observer
        observer: false,
        observeParents: false,
        /*
        Callbacks:
        onClick: function (swiper, e) 
        onTap: function (swiper, e) 
        onDoubleTap: function (swiper, e) 
        onSliderMove: function (swiper, e) 
        onSlideChangeStart: function (swiper) 
        onSlideChangeEnd: function (swiper) 
        onTransitionStart: function (swiper) 
        onTransitionEnd: function (swiper) 
        onImagesReady: function (swiper) 
        onProgress: function (swiper, progress) 
        onDestroy: function () 
        onTouchStart: function (swiper, e) 
        onTouchMove: function (swiper, e) 
        onTouchEnd: function (swiper, e) 
        onReachBeginning: function (swiper) 
        onReachEnd: function (swiper) 
        onSetTransition: function (swiper, duration) 
        onSetTranslate: function (swiper, translate) 
        */
    };
    params = params || {};
    for (var def in defaults) {
        if (typeof params[def] === 'undefined') {
            params[def] = defaults[def];
        }
        else if (typeof params[def] === 'object') {
            for (var deepDef in defaults[def]) {
                if (typeof params[def][deepDef] === 'undefined') {
                    params[def][deepDef] = defaults[def][deepDef];
                }
            }
        }
    }
    
    // Swiper
    var s = this;
    
    // Params
    s.params = params;
    /*=========================
      Dom Library and plugins
      ===========================*/
    var $;
    if (typeof Dom7 === 'undefined') {
        $ = window.Dom7 || window.Zepto || window.jQuery;
    }
    else {
        $ = Dom7;
    }
    if (!$) return;
    
    /*=========================
      Preparation - Define Container, Wrapper and Pagination
      ===========================*/
    s.container = $(container);
    if (s.container.length === 0) return;
    if (s.container.length > 1) {
        s.container.each(function () {
            new Swiper(this, params);
        });
        return;
    }
    
    // Save instance in container HTML Element and in data
    s.container[0].swiper = s;
    s.container.data('swiper', s);
    
    s.container.addClass('swiper-container-' + s.params.direction);
    
    if (s.params.freeMode) {
        s.container.addClass('swiper-container-free-mode');
    }
    
    // Coverflow / 3D
    if (['cube', 'coverflow'].indexOf(s.params.effect) >= 0) {
        if (s.support.transforms3d) {
            s.params.watchSlidesProgress = true;
            s.container.addClass('swiper-container-3d');
        }
        else {
            s.params.effect = 'slide';
        }
    }
    if (s.params.effect !== 'slide') {
        s.container.addClass('swiper-container-' + s.params.effect);
    }
    if (s.params.effect === 'cube') {
        s.params.resistanceRatio = 0;
        s.params.slidesPerView = 1;
        s.params.slidesPerColumn = 1;
        s.params.slidesPerGroup = 1;
        s.params.centeredSlides = false;
        s.params.spaceBetween = 0;
    }
    if (s.params.effect === 'fade') {
        s.params.watchSlidesProgress = true;
        s.params.spaceBetween = 0;
    }
    
    // Grab Cursor
    if (s.params.grabCursor && s.support.touch) {
        s.params.grabCursor = false;
    }
    
    // Wrapper
    s.wrapper = s.container.children('.' + s.params.wrapperClass);
    
    // Pagination
    if (s.params.pagination) {
        s.paginationContainer = $(s.params.pagination);
        if (s.params.paginationClickable) {
            s.paginationContainer.addClass('swiper-pagination-clickable');
        }
    }
    
    // Is Horizontal
    function isH() {
        return s.params.direction === 'horizontal';
    }
    
    // RTL
    s.rtl = isH() && (s.container[0].dir.toLowerCase() === 'rtl' || s.container.css('direction') === 'rtl');
    
    // Translate
    s.translate = 0;
    
    // Progress
    s.progress = 0;
    
    // Velocity
    s.velocity = 0;
    
    // Locks, unlocks
    s.lockSwipeToNext = function () {
        s.params.allowSwipeToNext = false;
    };
    s.lockSwipeToPrev = function () {
        s.params.allowSwipeToPrev = false;
    };
    s.lockSwipes = function () {
        s.params.allowSwipeToNext = s.params.allowSwipeToPrev = false;
    };
    s.unlockSwipeToNext = function () {
        s.params.allowSwipeToNext = true;
    };
    s.unlockSwipeToPrev = function () {
        s.params.allowSwipeToPrev = true;
    };
    s.unlockSwipes = function () {
        s.params.allowSwipeToNext = s.params.allowSwipeToPrev = true;
    };
    
    // Columns
    if (s.params.slidesPerColumn > 1) {
        s.container.addClass('swiper-container-multirow');
    }
    
    
    /*=========================
      Set grab cursor
      ===========================*/
    if (s.params.grabCursor) {
        s.container[0].style.cursor = 'move';
        s.container[0].style.cursor = '-webkit-grab';
        s.container[0].style.cursor = '-moz-grab';
        s.container[0].style.cursor = 'grab';
    }
    /*=========================
      Update on Images Ready
      ===========================*/
    s.imagesToLoad = [];
    s.imagesLoaded = 0;
    
    function loadImage(img) {
        var image, src;
        var onReady = function () {
            if (typeof s === 'undefined' || s === null) return;
            if (s.imagesLoaded !== undefined) s.imagesLoaded++;
            if (s.imagesLoaded === s.imagesToLoad.length) {
                s.update();
                if (s.params.onImagesReady) s.params.onImagesReady(s);
            }
        };
    
        if (!img.complete) {
            src = (img.currentSrc || img.getAttribute('src'));
            if (src) {
                image = new Image();
                image.onload = onReady;
                image.onerror = onReady;
                image.src = src;
            } else {
                onReady();
            }
    
        } else {//image already loaded...
            onReady();
        }
    }
    s.preloadImages = function () {
        s.imagesToLoad = s.container.find('img');
    
        for (var i = 0; i < s.imagesToLoad.length; i++) {
            loadImage(s.imagesToLoad[i]);
        }
    };
    
    /*=========================
      Autoplay
      ===========================*/
    s.autoplayTimeoutId = undefined;
    s.autoplaying = false;
    s.autoplayPaused = false;
    function autoplay() {
        s.autoplayTimeoutId = setTimeout(function () {
            if (s.params.loop) {
                s.fixLoop();
                s._slideNext();
            }
            else {
                if (!s.isEnd) {
                    s._slideNext();
                }
                else {
                    if (!params.autoplayStopOnLast) {
                        s._slideTo(0);
                    }
                    else {
                        s.stopAutoplay();
                    }
                }
            }
        }, s.params.autoplay);
    }
    s.startAutoplay = function () {
        if (typeof s.autoplayTimeoutId !== 'undefined') return false;
        if (!s.params.autoplay) return;
        if (s.autoplaying) return;
        s.autoplaying = true;
        if (s.params.onAutoplayStart) s.params.onAutoplayStart(s);
        autoplay();
    };
    s.stopAutoplay = function (internal) {
        if (!s.autoplayTimeoutId) return;
        if (s.autoplayTimeoutId) clearTimeout(s.autoplayTimeoutId);
        s.autoplaying = false;
        s.autoplayTimeoutId = undefined;
        if (s.params.onAutoplayStop) s.params.onAutoplayStop(s);
    };
    s.pauseAutoplay = function (speed) {
        if (s.autoplayPaused) return;
        if (s.autoplayTimeoutId) clearTimeout(s.autoplayTimeoutId);
        s.autoplayPaused = true;
        if (speed === 0) {
            s.autoplayPaused = false;
            autoplay();
        }
        else {
            s.wrapper.transitionEnd(function () {
                s.autoplayPaused = false;
                autoplay();
            });
        }
    };
    /*=========================
      Slider/slides sizes
      ===========================*/
    s.updateContainerSize = function () {
        s.width = s.container[0].clientWidth;
        s.height = s.container[0].clientHeight;
        s.size = isH() ? s.width : s.height;
    };
    
    s.updateSlidesSize = function () {
        s.slides = s.wrapper.children('.' + s.params.slideClass);
        s.snapGrid = [];
        s.slidesGrid = [];
        s.slidesSizesGrid = [];
        
        var spaceBetween = s.params.spaceBetween,
            slidePosition = 0,
            i,
            prevSlideSize = 0,
            index = 0;
        if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
            spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * s.size;
        }
    
        s.virtualWidth = -spaceBetween;
        // reset margins
        if (s.rtl) s.slides.css({marginLeft: '', marginTop: ''});
        else s.slides.css({marginRight: '', marginBottom: ''});
    
        var slidesNumberEvenToRows;
        if (s.params.slidesPerColumn > 1) {
            if (Math.floor(s.slides.length / s.params.slidesPerColumn) === s.slides.length / s.params.slidesPerColumn) {
                slidesNumberEvenToRows = s.slides.length;
            }
            else {
                slidesNumberEvenToRows = Math.ceil(s.slides.length / s.params.slidesPerColumn) * s.params.slidesPerColumn;
            }
        }
    
        // Calc slides
        var slideSize;
        for (i = 0; i < s.slides.length; i++) {
            slideSize = 0;
            var slide = s.slides.eq(i);
            if (s.params.slidesPerColumn > 1) {
                // Set slides order
                var newSlideOrderIndex;
                var column, row;
                var slidesPerColumn = s.params.slidesPerColumn;
                var slidesPerRow;
                if (s.params.slidesPerColumnFill === 'column') {
                    column = Math.floor(i / slidesPerColumn);
                    row = i - column * slidesPerColumn;
                    newSlideOrderIndex = column + row * slidesNumberEvenToRows / slidesPerColumn;
                    slide
                        .css({
                            '-webkit-box-ordinal-group': newSlideOrderIndex,
                            '-moz-box-ordinal-group': newSlideOrderIndex,
                            '-ms-flex-order': newSlideOrderIndex,
                            '-webkit-order': newSlideOrderIndex,
                            'order': newSlideOrderIndex
                        });
                }
                else {
                    slidesPerRow = slidesNumberEvenToRows / slidesPerColumn;
                    row = Math.floor(i / slidesPerRow);
                    column = i - row * slidesPerRow;
                    
                }
                slide
                    .css({
                        'margin-top': (row !== 0 && s.params.spaceBetween) && (s.params.spaceBetween + 'px')
                    })
                    .attr('data-swiper-column', column)
                    .attr('data-swiper-row', row);
                    
            }
            if (slide.css('display') === 'none') continue;
            if (s.params.slidesPerView === 'auto') {
                slideSize = isH() ? slide.outerWidth(true) : slide.outerHeight(true);
            }
            else {
                slideSize = (s.size - (s.params.slidesPerView - 1) * spaceBetween) / s.params.slidesPerView;
                if (isH()) {
                    s.slides[i].style.width = slideSize + 'px';
                }
                else {
                    s.slides[i].style.height = slideSize + 'px';
                }
            }
            s.slides[i].swiperSlideSize = slideSize;
            s.slidesSizesGrid.push(slideSize);
            
            
            if (s.params.centeredSlides) {
                slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
                if (i === 0) slidePosition = slidePosition - s.size / 2 - spaceBetween;
                if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
                if ((index) % s.params.slidesPerGroup === 0) s.snapGrid.push(slidePosition);
                s.slidesGrid.push(slidePosition);
            }
            else {
                if ((index) % s.params.slidesPerGroup === 0) s.snapGrid.push(slidePosition);
                s.slidesGrid.push(slidePosition);
                slidePosition = slidePosition + slideSize + spaceBetween;
            }
    
            s.virtualWidth += slideSize + spaceBetween;
    
            prevSlideSize = slideSize;
    
            index ++;
        }
        s.virtualWidth = Math.max(s.virtualWidth, s.size);
    
        var newSlidesGrid;
    
        if (s.params.slidesPerColumn > 1) {
            s.virtualWidth = (slideSize + s.params.spaceBetween) * slidesNumberEvenToRows;
            s.virtualWidth = Math.ceil(s.virtualWidth / s.params.slidesPerColumn) - s.params.spaceBetween;
            s.wrapper.css({width: s.virtualWidth + s.params.spaceBetween + 'px'});
            if (s.params.centeredSlides) {
                newSlidesGrid = [];
                for (i = 0; i < s.snapGrid.length; i++) {
                    if (s.snapGrid[i] < s.virtualWidth + s.snapGrid[0]) newSlidesGrid.push(s.snapGrid[i]);
                }
                s.snapGrid = newSlidesGrid;
            }
        }
    
        // Remove last grid elements depending on width
        if (!s.params.centeredSlides) {
            newSlidesGrid = [];
            for (i = 0; i < s.snapGrid.length; i++) {
                if (s.snapGrid[i] <= s.virtualWidth - s.size) {
                    newSlidesGrid.push(s.snapGrid[i]);
                }
            }
            s.snapGrid = newSlidesGrid;
            if (Math.floor(s.virtualWidth - s.size) > Math.floor(s.snapGrid[s.snapGrid.length - 1])) {
                s.snapGrid.push(s.virtualWidth - s.size);
            }
        }
        if (s.snapGrid.length === 0) s.snapGrid = [0];
            
        if (s.params.spaceBetween !== 0) {
            if (isH()) {
                if (s.rtl) s.slides.css({marginLeft: spaceBetween + 'px'});
                else s.slides.css({marginRight: spaceBetween + 'px'});
            }
            else s.slides.css({marginBottom: spaceBetween + 'px'});
        }
        if (s.params.watchSlidesProgress) {
            s.updateSlidesOffset();
        }
    };
    s.updateSlidesOffset = function () {
        for (var i = 0; i < s.slides.length; i++) {
            s.slides[i].swiperSlideOffset = isH() ? s.slides[i].offsetLeft : s.slides[i].offsetTop;
        }
    };
    
    s.update = function () {
        s.updateContainerSize();
        s.updateSlidesSize();
        s.updateProgress();
        s.updatePagination();
        s.updateClasses();
    };
    
    // Min/max translates
    s.minTranslate = function () {
        return (-s.snapGrid[0]);
    };
    s.maxTranslate = function () {
        return (-s.snapGrid[s.snapGrid.length - 1]);
    };
    
    /*=========================
      Slider/slides progress
      ===========================*/
    s.updateSlidesProgress = function (translate) {
        if (typeof translate === 'undefined') {
            translate = s.translate || 0;
        }
        if (s.slides.length === 0) return;
        if (typeof s.slides[0].swiperSlideOffset === 'undefined') s.updateSlidesOffset();
    
        var offsetCenter = s.params.centeredSlides ? -translate + s.size / 2 : -translate;
    
        // Visible Slides
        var containerBox = s.container[0].getBoundingClientRect();
        var sideBefore = isH() ? 'left' : 'top';
        var sideAfter = isH() ? 'right' : 'bottom';
        s.slides.removeClass(s.params.slideVisibleClass);
        for (var i = 0; i < s.slides.length; i++) {
            var slide = s.slides[i];
            var slideCenterOffset = (s.params.centeredSlides === true) ? slide.swiperSlideSize / 2 : 0;
            var slideProgress = (offsetCenter - slide.swiperSlideOffset - slideCenterOffset) / (slide.swiperSlideSize + s.params.spaceBetween);
            if (s.params.watchVisibility) {
                var slideBefore = -(offsetCenter - slide.swiperSlideOffset - slideCenterOffset);
                var slideAfter = slideBefore + s.slidesSizesGrid[i];
                var isVisible =
                    (slideBefore >= 0 && slideBefore < s.size) ||
                    (slideAfter > 0 && slideAfter <= s.size) ||
                    (slideBefore <= 0 && slideAfter >= s.size);
                if (isVisible) {
                    s.slides.eq(i).addClass(s.params.slideVisibleClass);
                }
            }
            slide.progress = slideProgress;
        }
    };
    s.updateProgress = function (translate) {
        if (typeof translate === 'undefined') {
            translate = s.translate || 0;
        }
        s.progress = (translate - s.minTranslate()) / (s.maxTranslate() - s.minTranslate());
        s.isBeginning = s.isEnd = false;
        
        if (s.progress <= 0) {
            s.isBeginning = true;
            if (s.params.onReachBeginning) s.params.onReachBeginning(s);
        }
        if (s.progress >= 1) {
            s.isEnd = true;
            if (s.params.onReachEnd) s.params.onReachEnd(s);
        }
        if (s.params.watchSlidesProgress) s.updateSlidesProgress(translate);
        if (s.params.onProgress) s.params.onProgress(s, s.progress);
    };
    s.updateActiveIndex = function () {
        var translate = s.rtl ? s.translate : -s.translate;
        var newActiveIndex, i, snapIndex;
        for (i = 0; i < s.slidesGrid.length; i ++) {
            if (typeof s.slidesGrid[i + 1] !== 'undefined') {
                if (translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1] - (s.slidesGrid[i + 1] - s.slidesGrid[i]) / 2) {
                    newActiveIndex = i;
                }
                else if (translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1]) {
                    newActiveIndex = i + 1;
                }
            }
            else {
                if (translate >= s.slidesGrid[i]) {
                    newActiveIndex = i;
                }
            }
        }
        // Normalize slideIndex
        if (newActiveIndex < 0 || typeof newActiveIndex === 'undefined') newActiveIndex = 0;
        // for (i = 0; i < s.slidesGrid.length; i++) {
            // if (- translate >= s.slidesGrid[i]) {
                // newActiveIndex = i;
            // }
        // }
        snapIndex = Math.floor(newActiveIndex / s.params.slidesPerGroup);
        if (snapIndex >= s.snapGrid.length) snapIndex = s.snapGrid.length - 1;
    
        if (newActiveIndex === s.activeIndex) {
            return;
        }
        s.snapIndex = snapIndex;
        s.previousIndex = s.activeIndex;
        s.activeIndex = newActiveIndex;
        s.updateClasses();
    };
    
    /*=========================
      Classes
      ===========================*/
    s.updateClasses = function () {
        s.slides.removeClass(s.params.slideActiveClass + ' ' + s.params.slideNextClass + ' ' + s.params.slidePrevClass);
        var activeSlide = s.slides.eq(s.activeIndex);
        // Active classes
        activeSlide.addClass(s.params.slideActiveClass);
        activeSlide.next('.' + s.params.slideClass).addClass(s.params.slideNextClass);
        activeSlide.prev('.' + s.params.slideClass).addClass(s.params.slidePrevClass);
    
        // Pagination
        if (s.bullets && s.bullets.length > 0) {
            s.bullets.removeClass(s.params.bulletActiveClass);
            var bulletIndex;
            if (s.params.loop) {
                bulletIndex = s.activeIndex - s.loopedSlides;
                if (bulletIndex > s.slides.length - 1 - s.loopedSlides * 2) {
                    bulletIndex = bulletIndex - (s.slides.length - s.loopedSlides * 2);
                }
            }
            else {
                if (typeof s.snapIndex !== 'undefined') {
                    bulletIndex = s.snapIndex;
                }
                else {
                    bulletIndex = s.activeIndex || 0;
                }
            }
            s.bullets.eq(bulletIndex).addClass(s.params.bulletActiveClass);
        }
    
        // Next/active buttons
        if (!s.params.loop) {
            if (s.params.prevButton) {
                if (s.isBeginning) $(s.params.prevButton).addClass(s.params.buttonDisabledClass);
                else $(s.params.prevButton).removeClass(s.params.buttonDisabledClass);
            }
            if (s.params.nextButton) {
                if (s.isEnd) $(s.params.nextButton).addClass(s.params.buttonDisabledClass);
                else $(s.params.nextButton).removeClass(s.params.buttonDisabledClass);
            }
        }
    };
    
    /*=========================
      Pagination
      ===========================*/
    s.updatePagination = function () {
        if (!s.params.pagination) return;
        if (s.paginationContainer && s.paginationContainer.length > 0) {
            var bulletsHTML = '';
            var numberOfBullets = s.params.loop ? s.slides.length - s.loopedSlides * 2 : s.snapGrid.length;
            for (var i = 0; i < numberOfBullets; i++) {
                bulletsHTML += '<span class="' + s.params.bulletClass + '"></span>';
            }
            s.paginationContainer.html(bulletsHTML);
            s.bullets = s.paginationContainer.find('.' + s.params.bulletClass);
        }
    };
    
    
    /*=========================
      Resize Handler
      ===========================*/
    s.onResize = function () {
        s.updateContainerSize();
        s.updateSlidesSize();
        s.updateProgress();
        s.updateClasses();
        if (s.params.slidesPerView === 'auto') s.updatePagination();
        if (s.isEnd) {
            s.slideTo(s.slides.length - 1, 0, false);
        }
        else {
            s.slideTo(s.activeIndex, 0, false);
        }
        if (s.params.scrollbar && s.scrollbar) {
            s.scrollbar.init();
        }
    };
    
    /*=========================
      Events
      ===========================*/
    
    //Define Touch Events
    var desktopEvents = ['mousedown', 'mousemove', 'mouseup'];
    if (window.navigator.pointerEnabled) desktopEvents = ['pointerdown', 'pointermove', 'pointerup'];
    else if (window.navigator.msPointerEnabled) desktopEvents = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp'];
    
    s.touchEvents = {
        start : s.support.touch || !s.params.simulateTouch  ? 'touchstart' : desktopEvents[0],
        move : s.support.touch || !s.params.simulateTouch ? 'touchmove' : desktopEvents[1],
        end : s.support.touch || !s.params.simulateTouch ? 'touchend' : desktopEvents[2]
    };
    
    // WP8 Touch Events Fix
    if (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) {
        (s.params.touchEventsTarget === 'container' ? s.container : s.wrapper).addClass('swiper-wp8-' + s.params.direction);
    }
    
    // Attach/detach events
    s.events = function (detach) {
        var action = detach ? 'off' : 'on';
        var touchEventsTarget = s.params.touchEventsTarget === 'container' ? s.container : s.wrapper;
        var target = s.support.touch ? touchEventsTarget : $(document);
    
        var moveCapture = s.params.nested ? true : false;
        // Touch events
        touchEventsTarget[action](s.touchEvents.start, s.onTouchStart, false);
        target[action](s.touchEvents.move, s.onTouchMove, moveCapture);
        target[action](s.touchEvents.end, s.onTouchEnd, false);
        $(window)[action]('resize', s.onResize);
    
        // Next, Prev, Index
        if (s.params.nextButton) $(s.params.nextButton)[action]('click', s.onClickNext);
        if (s.params.prevButton) $(s.params.prevButton)[action]('click', s.onClickPrev);
        if (s.params.pagination && s.params.paginationClickable) {
            $(s.paginationContainer)[action]('click', '.' + s.params.bulletClass, s.onClickIndex);
        }
    
        // Prevent Links Clicks
        if (s.params.preventClicks || s.params.clicksStopPropagation) touchEventsTarget[action]('click', 'a', s.preventClicks, true);
    };
    s.attachEvents = function (detach) {
        s.events();
    };
    s.detachEvents = function () {
        s.events(true);
    };
    
    /*=========================
      Handle Clicks
      ===========================*/
    // Prevent Clicks
    s.allowClick = true;
    s.preventClicks = function (e) {
        if (!s.allowClick) {
            if (s.params.preventClicks) e.preventDefault();
            if (s.params.clicksStopPropagation) {
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }
    };
    // Clicks
    s.onClickNext = function (e) {
        e.preventDefault();
        s.slideNext();
    };
    s.onClickPrev = function (e) {
        e.preventDefault();
        s.slidePrev();
    };
    s.onClickIndex = function (e) {
        e.preventDefault();
        var index = $(this).index() * s.params.slidesPerGroup;
        if (s.params.loop) index = index + s.loopedSlides;
        s.slideTo(index);
    };
    
    /*=========================
      Handle Touches
      ===========================*/
    function findElementInEvent(e, selector) {
        var el = $(e.target);
        if (!el.is(selector)) {
            if (typeof selector === 'string') {
                el = el.parents(selector);
            }
            else if (selector.nodeType) {
                var found;
                el.parents().each(function (index, _el) {
                    if (_el === selector) found = selector;
                });
                if (!found) return undefined;
                else return selector;
            }
        }
        if (el.length === 0) {
            return undefined;
        }
        return el[0];
    }
    s.updateClickedSlide = function (e) {
        var slide = findElementInEvent(e, '.' + s.params.slideClass);
        if (slide) {
            s.clickedSlide = slide;
            s.clickedIndex = $(slide).index();
        }
        if (s.params.slideToClickedSlide && s.clickedIndex !== undefined && s.clickedIndex !== s.activeIndex) {
            var slideToIndex = s.clickedIndex,
                realIndex;
            if (s.params.loop) {
                realIndex = $(s.clickedSlide).attr('data-swiper-slide-index');
                if (slideToIndex > s.slides.length - s.params.slidesPerView) {
                    s.fixLoop();
                    slideToIndex = s.wrapper.children('.' + s.params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]').eq(0).index();
                    setTimeout(function () {
                        s.slideTo(slideToIndex);
                    }, 0);
                }
                else if (slideToIndex < s.params.slidesPerView - 1) {
                    s.fixLoop();
                    var duplicatedSlides = s.wrapper.children('.' + s.params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]');
                    slideToIndex = duplicatedSlides.eq(duplicatedSlides.length - 1).index();
                    setTimeout(function () {
                        s.slideTo(slideToIndex);
                    }, 0);
                }
                else {
                    s.slideTo(slideToIndex);
                }
            }
            else {
                s.slideTo(slideToIndex);
            }
        }
    };
    
    var isTouched, isMoved, touchesStart = {}, touchesCurrent = {}, touchStartTime, isScrolling, currentTranslate, startTranslate, allowThresholdMove;
    s.animating = false;
    var lastClickTime = Date.now(), clickTimeout;
    var velocities = [], allowMomentumBounce;
    // Form elements to match
    var formElements = 'input, select, textarea, button';
    
    // Touch handlers
    s.onTouchStart = function (e) {
        if (e.originalEvent) e = e.originalEvent; //jQuery fix
        if (e.type === 'mousedown' && 'which' in e && e.which === 3) return;
        if (e.originalEvent) e = e.originalEvent;
        if (s.params.noSwiping && findElementInEvent(e, '.' + s.params.noSwipingClass)) return;
        if (s.params.swipeHandler) {
            if (!findElementInEvent(e, s.params.swipeHandler)) return;
        }
        isTouched = true;
        isMoved = false;
        isScrolling = undefined;
        touchesStart.x = touchesCurrent.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
        touchesStart.y = touchesCurrent.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
        touchStartTime = Date.now();
        s.allowClick = true;
        s.updateContainerSize();
        s.swipeDirection = undefined;
        if (s.params.threshold > 0) allowThresholdMove = false;
        if (e.type === 'mousedown') {
            var preventDefault = true;
            if ($(e.target).is(formElements)) preventDefault = false;
            if (document.activeElement && $(document.activeElement).is(formElements)) document.activeElement.blur();
        }
        if (s.params.onTouchStart) s.params.onTouchStart(s, e);
    };
    
    s.onTouchMove = function (e) {
        if (e.originalEvent) e = e.originalEvent; //jQuery fix
        if (e.preventedByNestedSwiper) return;
        if (s.params.onlyExternal) {
            isMoved = true;
            s.allowClick = false;
            return;
        }
        if (s.params.onTouchMove) s.params.onTouchMove(s, e);
        s.allowClick = false;
        if (!isTouched) return;
        if (e.targetTouches && e.targetTouches.length > 1) return;
        
        touchesCurrent.x = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
        touchesCurrent.y = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
    
        var touchAngle = Math.atan2(Math.abs(touchesCurrent.y - touchesStart.y), Math.abs(touchesCurrent.x - touchesStart.x)) * 180 / Math.PI;
        if (typeof isScrolling === 'undefined') {
            isScrolling = isH() ? touchAngle > s.params.touchAngle : (90 - touchAngle > s.params.touchAngle);
            // isScrolling = !!(isScrolling || Math.abs(touchesCurrent.y - touchesStart.y) > Math.abs(touchesCurrent.x - touchesStart.x));
        }
        if (isScrolling)  {
            isTouched = false;
            return;
        }
        if (s.params.onSliderMove) s.params.onSliderMove(s, e);
    
        e.preventDefault();
        if (s.params.touchMoveStopPropagation && !s.params.nested) {
            e.stopPropagation();
        }
    
        if (!isMoved) {
            if (params.loop) {
                s.fixLoop();
            }
            startTranslate = s.params.effect === 'cube' ? (s.translate || 0) : s.getWrapperTranslate();
            s.setWrapperTransition(0);
            if (s.animating) {
                s.wrapper.trigger('webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd');
            }
            if (s.params.autoplay && s.autoplaying) {
                if (s.params.autoplayDisableOnInteraction) {
                    s.stopAutoplay();
                }
                else {
                    s.pauseAutoplay();
                }
            }
            allowMomentumBounce = false;
            //Grab Cursor
            if (s.params.grabCursor) {
                s.container[0].style.cursor = 'move';
                s.container[0].style.cursor = '-webkit-grabbing';
                s.container[0].style.cursor = '-moz-grabbin';
                s.container[0].style.cursor = 'grabbing';
            }
        }
        isMoved = true;
    
        var diff = isH() ? touchesCurrent.x - touchesStart.x : touchesCurrent.y - touchesStart.y;
    
        diff = diff * s.params.touchRatio;
        if (s.rtl) diff = -diff;
    
        s.swipeDirection = diff > 0 ? 'prev' : 'next';
        currentTranslate = diff + startTranslate;
    
        var disableParentSwiper = true;
        if ((diff > 0 && currentTranslate > s.minTranslate())) {
            disableParentSwiper = false;
            if (s.params.resistance) currentTranslate = s.minTranslate() - 1 + Math.pow(-s.minTranslate() + startTranslate + diff, s.params.resistanceRatio);
        }
        else if (diff < 0 && currentTranslate < s.maxTranslate()) {
            disableParentSwiper = false;
            if (s.params.resistance) currentTranslate = s.maxTranslate() + 1 - Math.pow(s.maxTranslate() - startTranslate - diff, s.params.resistanceRatio);
        }
        
        if (disableParentSwiper) {
            e.preventedByNestedSwiper = true;
        }
    
        // Directions locks
        if (!s.params.allowSwipeToNext && s.swipeDirection === 'next' && currentTranslate < startTranslate) {
            currentTranslate = startTranslate;
        }
        if (!s.params.allowSwipeToPrev && s.swipeDirection === 'prev' && currentTranslate > startTranslate) {
            currentTranslate = startTranslate;
        }
        
        if (!s.params.followFinger) return;
    
        // Threshold
        if (s.params.threshold > 0) {
            if (Math.abs(diff) > s.params.threshold || allowThresholdMove) {
                if (!allowThresholdMove) {
                    allowThresholdMove = true;
                    touchesStart.x = touchesCurrent.x;
                    touchesStart.y = touchesCurrent.y;
                    currentTranslate = startTranslate;
                    return;
                }
            }
            else {
                currentTranslate = startTranslate;
                return;
            }
        }
        // Update active index in free mode
        if (s.params.freeMode || s.params.watchSlidesProgress) {
            s.updateActiveIndex();
        }
        if (s.params.freeMode) {
            //Velocity
            if (velocities.length === 0) {
                velocities.push({
                    position: touchesStart[isH() ? 'x' : 'y'],
                    time: touchStartTime
                });
            }
            velocities.push({
                position: touchesCurrent[isH() ? 'x' : 'y'],
                time: (new Date()).getTime()
            });
        }
        // Update progress
        s.updateProgress(currentTranslate);
        // Update translate
        s.setWrapperTranslate(currentTranslate);
    };
    s.onTouchEnd = function (e) {
        if (e.originalEvent) e = e.originalEvent; //jQuery fix
        if (!isTouched) return;
        if (s.params.onTouchEnd) s.params.onTouchEnd(s, e);
    
        //Return Grab Cursor
        if (s.params.grabCursor && isMoved && isTouched) {
            s.container[0].style.cursor = 'move';
            s.container[0].style.cursor = '-webkit-grab';
            s.container[0].style.cursor = '-moz-grab';
            s.container[0].style.cursor = 'grab';
        }
    
        // Time diff
        var touchEndTime = Date.now();
        var timeDiff = touchEndTime - touchStartTime;
    
        // Tap, doubleTap, Click
        if (s.allowClick) {
            s.updateClickedSlide(e);
            if (s.params.onTap) s.params.onTap(s, e);
            if (timeDiff < 300 && (touchEndTime - lastClickTime) > 300) {
                if (clickTimeout) clearTimeout(clickTimeout);
                clickTimeout = setTimeout(function () {
                    if (!s) return;
                    if (s.params.paginationHide && s.paginationContainer.length > 0 && !$(e.target).hasClass(s.params.bulletClass)) {
                        s.paginationContainer.toggleClass(s.params.paginationHiddenClass);
                    }
                    if (s.params.onClick) s.params.onClick(s, e);
                }, 300);
                
            }
            if (timeDiff < 300 && (touchEndTime - lastClickTime) < 300) {
                if (clickTimeout) clearTimeout(clickTimeout);
                if (s.params.onDoubleTap) {
                    s.params.onDoubleTap(s, e);
                }
            }
        }
    
        lastClickTime = Date.now();
        setTimeout(function () {
            if (s && s.allowClick) s.allowClick = true;
        }, 0);
    
        var touchesDiff = isH() ? touchesCurrent.x - touchesStart.x : touchesCurrent.y - touchesStart.y;
    
        if (!isTouched || !isMoved || !s.swipeDirection || touchesDiff === 0 || currentTranslate === startTranslate) {
            isTouched = isMoved = false;
            return;
        }
        isTouched = isMoved = false;
    
        var currentPos;
        if (s.params.followFinger) {
            currentPos = s.rtl ? s.translate : -s.translate;
        }
        else {
            currentPos = -currentTranslate;
        }
        if (s.params.freeMode) {
            if (currentPos < -s.minTranslate()) {
                s.slideTo(s.activeIndex);
                return;
            }
            else if (currentPos > -s.maxTranslate()) {
                s.slideTo(s.slides.length - 1);
                return;
            }
            
            if (s.params.freeModeMomentum) {
                if (velocities.length > 1) {
                    var lastMoveEvent = velocities.pop(), velocityEvent = velocities.pop();
    
                    var distance = lastMoveEvent.position - velocityEvent.position;
                    var time = lastMoveEvent.time - velocityEvent.time;
    
                    s.velocity = distance / time;
                    s.velocity = s.velocity / 2;
                    if (Math.abs(s.velocity) < 0.02) {
                        s.velocity = 0;
                    }
                    // this implies that the user stopped moving a finger then released.
                    // There would be no events with distance zero, so the last event is stale.
                    // if (Math.abs(s.velocity) < 0.1 & time > 150 || timeDiff > 300) {
                    if (time > 150 || timeDiff > 300) {
                        s.velocity = 0;
                    }
                } else {
                    s.velocity = 0;
                }
    
                velocities.length = 0;
    
                var momentumDuration = 1000 * s.params.freeModeMomentumRatio;
                var momentumDistance = s.velocity * momentumDuration;
    
                var newPosition = s.translate + momentumDistance;
                var doBounce = false;
                var afterBouncePosition;
                var bounceAmount = Math.abs(s.velocity) * 20 * s.params.freeModeMomentumBounceRatio;
                if (newPosition < s.maxTranslate()) {
                    if (s.params.freeModeMomentumBounce) {
                        if (newPosition + s.maxTranslate() < -bounceAmount) newPosition = s.maxTranslate() - bounceAmount;
                        afterBouncePosition = s.maxTranslate();
                        doBounce = true;
                        allowMomentumBounce = true;
                    }
                    else newPosition = s.maxTranslate();
                }
                if (newPosition > s.minTranslate()) {
                    if (s.params.freeModeMomentumBounce) {
                        if (newPosition - s.minTranslate() > bounceAmount) {
                            newPosition = s.minTranslate() + bounceAmount;
                        }
                        afterBouncePosition = s.minTranslate();
                        doBounce = true;
                        allowMomentumBounce = true;
                    }
                    else newPosition = s.minTranslate();
                }
                //Fix duration
                if (s.velocity !== 0) {
                    momentumDuration = Math.abs((newPosition - s.translate) / s.velocity);
                }
    
                if (s.params.freeModeMomentumBounce && doBounce) {
                    s.updateProgress(afterBouncePosition);
                    s.setWrapperTranslate(newPosition);
                    s.setWrapperTransition(momentumDuration);
                    s.onTransitionStart();
                    s.animating = true;
                    s.wrapper.transitionEnd(function () {
                        if (!allowMomentumBounce) return;
                        if (s.params.onMomentumBounce) s.params.onMomentumBounce(s);
    
                        s.setWrapperTranslate(afterBouncePosition);
                        s.setWrapperTransition(s.params.speed);
                        s.wrapper.transitionEnd(function () {
                            s.onTransitionEnd();
                        });
                    });
                } else if (s.velocity) {
                    s.updateProgress(newPosition);
                    s.setWrapperTranslate(newPosition);
                    s.setWrapperTransition(momentumDuration);
                    s.onTransitionStart();
                    if (!s.animating) {
                        s.animating = true;
                        s.wrapper.transitionEnd(function () {
                            s.onTransitionEnd();
                        });
                    }
                        
                } else {
                    s.updateProgress(newPosition);
                }
                
                s.updateActiveIndex();
            }
            if (!s.params.freeModeMomentum || timeDiff >= s.params.longSwipesMs) {
                s.updateProgress();
                s.updateActiveIndex();
            }
            return;
        }
    
        // Find current slide
        var i, stopIndex = 0, groupSize = s.slidesSizesGrid[0];
        for (i = 0; i < s.slidesGrid.length; i += s.params.slidesPerGroup) {
            if (typeof s.slidesGrid[i + s.params.slidesPerGroup] !== 'undefined') {
                if (currentPos >= s.slidesGrid[i] && currentPos < s.slidesGrid[i + s.params.slidesPerGroup]) {
                    stopIndex = i;
                    groupSize = s.slidesGrid[i + s.params.slidesPerGroup] - s.slidesGrid[i];
                }
            }
            else {
                if (currentPos >= s.slidesGrid[i]) {
                    stopIndex = i;
                    groupSize = s.slidesGrid[s.slidesGrid.length - 1] - s.slidesGrid[s.slidesGrid.length - 2];
                }
            }
        }
    
        // Find current slide size
        var ratio = (currentPos - s.slidesGrid[stopIndex]) / groupSize;
        
        if (timeDiff > s.params.longSwipesMs) {
            // Long touches
            if (!s.params.longSwipes) {
                s.slideTo(s.activeIndex);
                return;
            }
            if (s.swipeDirection === 'next') {
                if (ratio >= s.params.longSwipesRatio) s.slideTo(stopIndex + s.params.slidesPerGroup);
                else s.slideTo(stopIndex);
    
            }
            if (s.swipeDirection === 'prev') {
                if (ratio > (1 - s.params.longSwipesRatio)) s.slideTo(stopIndex + s.params.slidesPerGroup);
                else s.slideTo(stopIndex);
            }
        }
        else {
            // Short swipes
            if (!s.params.shortSwipes) {
                s.slideTo(s.activeIndex);
                return;
            }
            if (s.swipeDirection === 'next') {
                s.slideTo(stopIndex + s.params.slidesPerGroup);
    
            }
            if (s.swipeDirection === 'prev') {
                s.slideTo(stopIndex);
            }
        }
    };
    /*=========================
      Transitions
      ===========================*/
    s._slideTo = function (slideIndex, speed) {
        return s.slideTo(slideIndex, speed, true, true);
    };
    s.slideTo = function (slideIndex, speed, runCallbacks, internal) {
        if (typeof runCallbacks === 'undefined') runCallbacks = true;
        if (typeof slideIndex === 'undefined') slideIndex = 0;
        if (slideIndex < 0) slideIndex = 0;
        s.snapIndex = Math.floor(slideIndex / s.params.slidesPerGroup);
        if (s.snapIndex >= s.snapGrid.length) s.snapIndex = s.snapGrid.length - 1;
        
        var translate = - s.snapGrid[s.snapIndex];
    
        // Stop autoplay
    
        if (s.params.autoplay && s.autoplaying) {
            if (internal || !s.params.autoplayDisableOnInteraction) {
                s.pauseAutoplay(speed);
            }
            else {
                s.stopAutoplay();
            }
        }
        // Update progress
        s.updateProgress(translate);
    
        // Normalize slideIndex
        for (var i = 0; i < s.slidesGrid.length; i++) {
            if (- translate >= s.slidesGrid[i]) {
                slideIndex = i;
            }
        }
    
        if (typeof speed === 'undefined') speed = s.params.speed;
        s.previousIndex = s.activeIndex || 0;
        s.activeIndex = slideIndex;
        
        if (translate === s.translate) {
            s.updateClasses();
            return false;
        }
        if (runCallbacks) s.onTransitionStart();
        var translateX = isH() ? translate : 0, translateY = isH() ? 0 : translate;
        if (speed === 0) {
            s.setWrapperTransition(0);
            s.setWrapperTranslate(translate);
            if (runCallbacks) s.onTransitionEnd();
        }
        else {
            s.setWrapperTransition(speed);
            s.setWrapperTranslate(translate);
            if (!s.animating) {
                s.animating = true;
                s.wrapper.transitionEnd(function () {
                    if (runCallbacks) s.onTransitionEnd();
                });
            }
                
        }
        s.updateClasses();
    };
    
    s.onTransitionStart = function () {
        if (s.params.onTransitionStart) s.params.onTransitionStart(s);
        if (s.params.onSlideChangeStart && s.activeIndex !== s.previousIndex) s.params.onSlideChangeStart(s);
    };
    s.onTransitionEnd = function () {
        s.animating = false;
        s.setWrapperTransition(0);
        if (s.params.onTransitionEnd) s.params.onTransitionEnd(s);
        if (s.params.onSlideChangeEnd && s.activeIndex !== s.previousIndex) s.params.onSlideChangeEnd(s);
    };
    s.slideNext = function (runCallbacks, speed, internal) {
        if (s.params.loop) {
            if (s.animating) return false;
            s.fixLoop();
            setTimeout(function () {
                return s.slideTo(s.activeIndex + 1, speed, runCallbacks, internal);
            }, 0);
        }
        else return s.slideTo(s.activeIndex + s.params.slidesPerGroup, speed, runCallbacks, internal);
    };
    s._slideNext = function (speed) {
        return s.slideNext(true, speed, true);
    };
    s.slidePrev = function (runCallbacks, speed, internal) {
        if (s.params.loop) {
            if (s.animating) return false;
            s.fixLoop();
            setTimeout(function () {
                return s.slideTo(s.activeIndex - 1, speed, runCallbacks, internal);
            }, 0);
        }
        else return s.slideTo(s.activeIndex - 1, speed, runCallbacks, internal);
    };
    s._slidePrev = function (speed) {
        return s.slidePrev(true, speed, true);
    };
    s.slideReset = function (runCallbacks, speed, internal) {
        return s.slideTo(s.activeIndex, speed, runCallbacks);
    };
    
    /*=========================
      Translate/transition helpers
      ===========================*/
    s.setWrapperTransition = function (duration, byController) {
        s.wrapper.transition(duration);
        if (s.params.onSetTransition) s.params.onSetTransition(s, duration);
        if (s.params.effect !== 'slide' && s.effects[s.params.effect]) {
            s.effects[s.params.effect].setTransition(duration);
        }
        if (s.params.scrollbar && s.scrollbar) {
            s.scrollbar.setTransition(duration);
        }
        if (s.params.control && s.controller) {
            s.controller.setTransition(duration, byController);
        }
    };
    s.setWrapperTranslate = function (translate, updateActiveIndex, byController) {
        var x = 0, y = 0, z = 0;
        if (isH()) {
            x = s.rtl ? -translate : translate;
        }
        else {
            y = translate;
        }
        
        if (s.support.transforms3d) s.wrapper.transform('translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)');
        else s.wrapper.transform('translate(' + x + 'px, ' + y + 'px)');
        s.translate = isH() ? x : y;
        if (updateActiveIndex) s.updateActiveIndex();
        if (s.params.effect !== 'slide' && s.effects[s.params.effect]) {
            s.effects[s.params.effect].setTranslate(s.translate);
        }
        if (s.params.scrollbar && s.scrollbar) {
            s.scrollbar.setTranslate(s.translate);
        }
        if (s.params.control && s.controller) {
            s.controller.setTranslate(s.translate, byController);
        }
        if (s.params.hashnav && s.hashnav) {
            s.hashnav.setHash();
        }
        if (s.params.onSetTranslate) s.params.onSetTranslate(s, s.translate);
    };
    
    s.getTranslate = function (el, axis) {
        var matrix, curTransform, curStyle, transformMatrix;
    
        // automatic axis detection
        if (typeof axis === 'undefined') {
            axis = 'x';
        }
    
        curStyle = window.getComputedStyle(el, null);
        if (window.WebKitCSSMatrix) {
            // Some old versions of Webkit choke when 'none' is passed; pass
            // empty string instead in this case
            transformMatrix = new WebKitCSSMatrix(curStyle.webkitTransform === 'none' ? '' : curStyle.webkitTransform);
        }
        else {
            transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform  || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
            matrix = transformMatrix.toString().split(',');
        }
    
        if (axis === 'x') {
            //Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix)
                curTransform = transformMatrix.m41;
            //Crazy IE10 Matrix
            else if (matrix.length === 16)
                curTransform = parseFloat(matrix[12]);
            //Normal Browsers
            else
                curTransform = parseFloat(matrix[4]);
        }
        if (axis === 'y') {
            //Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix)
                curTransform = transformMatrix.m42;
            //Crazy IE10 Matrix
            else if (matrix.length === 16)
                curTransform = parseFloat(matrix[13]);
            //Normal Browsers
            else
                curTransform = parseFloat(matrix[5]);
        }
        if (s.rtl && curTransform) curTransform = -curTransform;
        return curTransform || 0;
    };
    s.getWrapperTranslate = function (axis) {
        if (typeof axis === 'undefined') {
            axis = isH() ? 'x' : 'y';
        }
        return s.getTranslate(s.wrapper[0], axis);
    };
    
    /*=========================
      Observer
      ===========================*/
    s.observers = [];
    function initObserver(target, options) {
        options = options || {};
        // create an observer instance
        var ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
        var observer = new ObserverFunc(function (mutations) {
            mutations.forEach(function (mutation) {
                s.onResize();
            });
        });
         
        observer.observe(target, {
            attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
            childList: typeof options.childList === 'undefined' ? true : options.childList,
            characterData: typeof options.characterData === 'undefined' ? true : options.characterData
        });
    
        s.observers.push(observer);
    }
    s.initObservers = function () {
        if (s.params.observeParents) {
            var containerParents = s.container.parents();
            for (var i = 0; i < containerParents.length; i++) {
                initObserver(containerParents[i]);
            }
        }
    
        // Observe container
        initObserver(s.container[0], {childList: false});
    
        // Observe wrapper
        initObserver(s.wrapper[0], {attributes: false});
    };
    s.disconnectObservers = function () {
        for (var i = 0; i < s.observers.length; i++) {
            s.observers[i].disconnect();
        }
        s.observers = [];
    };
    /*=========================
      Loop
      ===========================*/
    // Create looped slides
    s.createLoop = function () {
        // Remove duplicated slides
        s.wrapper.children('.' + s.params.slideClass + '.' + s.params.slideDuplicateClass).remove();
    
        var slides = s.wrapper.children('.' + s.params.slideClass);
        s.loopedSlides = parseInt(s.params.loopedSlides || s.params.slidesPerView, 10);
        s.loopedSlides = s.loopedSlides + s.params.loopAdditionalSlides;
        if (s.loopedSlides > slides.length) {
            s.loopedSlides = slides.length;
        }
    
        var prependSlides = [], appendSlides = [], i;
        slides.each(function (index, el) {
            var slide = $(this);
            if (index < s.loopedSlides) appendSlides.push(el);
            if (index < slides.length && index >= slides.length - s.loopedSlides) prependSlides.push(el);
            slide.attr('data-swiper-slide-index', index);
        });
        for (i = 0; i < appendSlides.length; i++) {
            s.wrapper.append($(appendSlides[i].cloneNode(true)).addClass(s.params.slideDuplicateClass));
        }
        for (i = prependSlides.length - 1; i >= 0; i--) {
            s.wrapper.prepend($(prependSlides[i].cloneNode(true)).addClass(s.params.slideDuplicateClass));
        }
    };
    s.deleteLoop = function () {
        s.wrapper.children('.' + s.params.slideClass + '.' + s.params.slideDuplicateClass).remove();
    };
    s.fixLoop = function () {
        var newIndex;
        //Fix For Negative Oversliding
        if (s.activeIndex < s.loopedSlides) {
            newIndex = s.slides.length - s.loopedSlides * 3 + s.activeIndex;
            newIndex = newIndex + s.loopedSlides;
            s.slideTo(newIndex, 0, false, true);
        }
        //Fix For Positive Oversliding
        else if ((s.params.slidesPerView === 'auto' && s.activeIndex >= s.loopedSlides * 2) || (s.activeIndex > s.slides.length - s.params.slidesPerView * 2)) {
            newIndex = -s.slides.length + s.activeIndex + s.loopedSlides;
            newIndex = newIndex + s.loopedSlides;
            s.slideTo(newIndex, 0, false, true);
        }
    };
    /*=========================
      Append/Prepend Slides
      ===========================*/
    s.appendSlide = function (slides) {
        if (s.params.loop) {
            s.deleteLoop();
        }
        if (typeof slides === 'object' && slides.length) {
            for (var i = 0; i < slides.length; i++) {
                if (slides[i]) s.wrapper.append(slides[i]);
            }
        }
        else {
            s.wrapper.append(slides);
        }
        if (s.params.loop) {
            s.createLoop();
        }
        if (!(s.params.observer && s.support.observer)) {
            s.update();
        }
    };
    s.prependSlide = function (slides) {
        if (s.params.loop) {
            s.deleteLoop();
        }
        var newActiveIndex = s.activeIndex + 1;
        if (typeof slides === 'object' && slides.length) {
            for (var i = 0; i < slides.length; i++) {
                if (slides[i]) s.wrapper.prepend(slides[i]);
            }
            newActiveIndex = s.activeIndex + slides.length;
        }
        else {
            s.wrapper.prepend(slides);
        }
        if (s.params.loop) {
            s.createLoop();
        }
        if (!(s.params.observer && s.support.observer)) {
            s.update();
        }
        s.slideTo(newActiveIndex, 0, false);
    };
    

    /*=========================
      Effects
      ===========================*/
    s.effects = {
        fade: {
            setTranslate: function () {
                for (var i = 0; i < s.slides.length; i++) {
                    var slide = s.slides.eq(i);
                    var offset = slide[0].swiperSlideOffset;
                    var tx = -offset - s.translate;
                    var ty = 0;
                    if (!isH()) {
                        ty = tx;
                        tx = 0;
                    }
                    slide
                        .css({
                            opacity: 1 + Math.min(Math.max(slide[0].progress, -1), 0)
                        })
                        .transform('translate3d(' + tx + 'px, ' + ty + 'px, 0px)');
    
                }
            },
            setTransition: function (duration) {
                s.slides.transition(duration);
            }
        },
        cube: {
            setTranslate: function () {
                var wrapperRotate = 0, cubeShadow;
                if (s.params.cube.shadow) {
                    if (isH()) {
                        cubeShadow = s.wrapper.find('.swiper-cube-shadow');
                        if (cubeShadow.length === 0) {
                            cubeShadow = $('<div class="swiper-cube-shadow"></div>');
                            s.wrapper.append(cubeShadow);
                        }
                        cubeShadow.css({height: s.width + 'px'});
                    }
                    else {
                        cubeShadow = s.container.find('.swiper-cube-shadow');
                        if (cubeShadow.length === 0) {
                            cubeShadow = $('<div class="swiper-cube-shadow"></div>');
                            s.container.append(cubeShadow);
                        }
                    }
                }
                for (var i = 0; i < s.slides.length; i++) {
                    var slide = s.slides.eq(i);
                    var slideAngle = i * 90;
                    var progress = Math.max(Math.min(slide[0].progress, 1), -1);
                    var tx = 0, ty = 0, tz = 0;
                    var round = Math.floor(slideAngle / 360);
                    if (i % 4 === 0) {
                        tx = - round * 4 * s.size;
                        tz = 0;
                    }
                    else if ((i - 1) % 4 === 0) {
                        tx = 0;
                        tz = - round * 4 * s.size;
                    }
                    else if ((i - 2) % 4 === 0) {
                        tx = s.size + round * 4 * s.size;
                        tz = s.size;
                    }
                    else if ((i - 3) % 4 === 0) {
                        tx = - s.size;
                        tz = 3 * s.size + s.size * 4 * round;
                    }
                    if (!isH()) {
                        ty = tx;
                        tx = 0;
                    }
                    
                    var transform = 'rotateX(' + (isH() ? 0 : -slideAngle) + 'deg) rotateY(' + (isH() ? slideAngle : 0) + 'deg) translate3d(' + tx + 'px, ' + ty + 'px, ' + tz + 'px)';
                    if (progress <= 1 && progress > -1) {
                        wrapperRotate = i * 90 + progress * 90;
                    }
                    slide.transform(transform);
                    if (s.params.cube.slideShadows) {
                        //Set shadows
                        var shadowBefore = isH() ? slide.find('.swiper-slide-shadow-left') : slide.find('.swiper-slide-shadow-top');
                        var shadowAfter = isH() ? slide.find('.swiper-slide-shadow-right') : slide.find('.swiper-slide-shadow-bottom');
                        if (shadowBefore.length === 0) {
                            shadowBefore = $('<div class="swiper-slide-shadow-' + (isH() ? 'left' : 'top') + '"></div>');
                            slide.append(shadowBefore);
                        }
                        if (shadowAfter.length === 0) {
                            shadowAfter = $('<div class="swiper-slide-shadow-' + (isH() ? 'right' : 'bottom') + '"></div>');
                            slide.append(shadowAfter);
                        }
                        var shadowOpacity = slide[0].progress;
                        if (shadowBefore.length) shadowBefore[0].style.opacity = -slide[0].progress;
                        if (shadowAfter.length) shadowAfter[0].style.opacity = slide[0].progress;
                    }
                }
                s.wrapper.css({
                    '-webkit-transform-origin': '50% 50% -' + (s.size / 2) + 'px',
                    '-moz-transform-origin': '50% 50% -' + (s.size / 2) + 'px',
                    '-ms-transform-origin': '50% 50% -' + (s.size / 2) + 'px',
                    'transform-origin': '50% 50% -' + (s.size / 2) + 'px'
                });
                    
                if (s.params.cube.shadow) {
                    if (isH()) {
                        cubeShadow.transform('translate3d(0px, ' + (s.width / 2 + s.params.cube.shadowOffset) + 'px, ' + (-s.width / 2) + 'px) rotateX(90deg) rotateZ(0deg) scale(' + (s.params.cube.shadowScale) + ')');
                    }
                    else {
                        var shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
                        var multiplier = 1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);
                        var scale1 = s.params.cube.shadowScale,
                            scale2 = s.params.cube.shadowScale / multiplier,
                            offset = s.params.cube.shadowOffset;
                        cubeShadow.transform('scale3d(' + scale1 + ', 1, ' + scale2 + ') translate3d(0px, ' + (s.height / 2 + offset) + 'px, ' + (-s.height / 2 / scale2) + 'px) rotateX(-90deg)');
                    }
                }
                var zFactor = (s.isSafari || s.isUiWebView) ? (-s.size / 2) : 0;
                s.wrapper.transform('translate3d(0px,0,' + zFactor + 'px) rotateX(' + (isH() ? 0 : wrapperRotate) + 'deg) rotateY(' + (isH() ? -wrapperRotate : 0) + 'deg)');
            },
            setTransition: function (duration) {
                s.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
                if (s.params.cube.shadow && !isH()) {
                    s.container.find('.swiper-cube-shadow').transition(duration);
                }
            }
        },
        coverflow: {
            setTranslate: function () {
                var transform = s.translate;
                var center = isH() ? -transform + s.width / 2 : -transform + s.height / 2;
                var rotate = isH() ? s.params.coverflow.rotate: -s.params.coverflow.rotate;
                var translate = s.params.coverflow.depth;
                //Each slide offset from center
                for (var i = 0, length = s.slides.length; i < length; i++) {
                    var slide = s.slides.eq(i);
                    var slideSize = s.slidesSizesGrid[i];
                    var slideOffset = slide[0].swiperSlideOffset;
                    var offsetMultiplier = (center - slideOffset - slideSize / 2) / slideSize * s.params.coverflow.modifier;
    
                    var rotateY = isH() ? rotate * offsetMultiplier : 0;
                    var rotateX = isH() ? 0 : rotate * offsetMultiplier;
                    // var rotateZ = 0
                    var translateZ = -translate * Math.abs(offsetMultiplier);
    
                    var translateY = isH() ? 0 : s.params.coverflow.stretch * (offsetMultiplier);
                    var translateX = isH() ? s.params.coverflow.stretch * (offsetMultiplier) : 0;
    
                    //Fix for ultra small values
                    if (Math.abs(translateX) < 0.001) translateX = 0;
                    if (Math.abs(translateY) < 0.001) translateY = 0;
                    if (Math.abs(translateZ) < 0.001) translateZ = 0;
                    if (Math.abs(rotateY) < 0.001) rotateY = 0;
                    if (Math.abs(rotateX) < 0.001) rotateX = 0;
    
                    var slideTransform = 'translate3d(' + translateX + 'px,' + translateY + 'px,' + translateZ + 'px)  rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
    
                    slide.transform(slideTransform);
                    slide[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
                    if (s.params.coverflow.slideShadows) {
                        //Set shadows
                        var shadowBefore = isH() ? slide.find('.swiper-slide-shadow-left') : slide.find('.swiper-slide-shadow-top');
                        var shadowAfter = isH() ? slide.find('.swiper-slide-shadow-right') : slide.find('.swiper-slide-shadow-bottom');
                        if (shadowBefore.length === 0) {
                            shadowBefore = $('<div class="swiper-slide-shadow-' + (isH() ? 'left' : 'top') + '"></div>');
                            slide.append(shadowBefore);
                        }
                        if (shadowAfter.length === 0) {
                            shadowAfter = $('<div class="swiper-slide-shadow-' + (isH() ? 'right' : 'bottom') + '"></div>');
                            slide.append(shadowAfter);
                        }
                        if (shadowBefore.length) shadowBefore[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
                        if (shadowAfter.length) shadowAfter[0].style.opacity = (-offsetMultiplier) > 0 ? -offsetMultiplier : 0;
                    }
                }
    
                //Set correct perspective for IE10
                if (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) {
                    var ws = s.wrapper.style;
                    ws.perspectiveOrigin = center + 'px 50%';
                }
            },
            setTransition: function (duration) {
                s.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
            }
        }
    };

    /*=========================
      Scrollbar
      ===========================*/
    s.scrollbar = {
        init: function () {
            if (!s.params.scrollbar) return;
            var sb = s.scrollbar;
            sb.track = $(s.params.scrollbar);
            sb.drag = sb.track.find('.swiper-scrollbar-drag');
            if (sb.drag.length === 0) {
                sb.drag = $('<div class="swiper-scrollbar-drag"></div>');
                sb.track.append(sb.drag);
            }
            sb.drag[0].style.width = '';
            sb.drag[0].style.height = '';
            sb.trackSize = isH() ? sb.track[0].offsetWidth : sb.track[0].offsetHeight;
            
            sb.divider = s.size / s.virtualWidth;
            sb.moveDivider = sb.divider * (sb.trackSize / s.size);
            sb.dragSize = sb.trackSize * sb.divider;
    
            if (isH()) {
                sb.drag[0].style.width = sb.dragSize + 'px';
            }
            else {
                sb.drag[0].style.height = sb.dragSize + 'px';
            }
    
            if (sb.divider >= 1) {
                sb.track[0].style.display = 'none';
            }
            else {
                sb.track[0].style.display = '';
            }
            if (s.params.scrollbarHide) {
                sb.track[0].style.opacity = 0;
            }
        },
        setTranslate: function () {
            if (!s.params.scrollbar) return;
            var diff;
            var sb = s.scrollbar;
            var translate = s.translate || 0;
            var newPos;
            
            var newSize = sb.dragSize;
            newPos = (sb.trackSize - sb.dragSize) * s.progress;
            if (s.rtl && isH()) {
                newPos = -newPos;
                if (newPos > 0) {
                    newSize = sb.dragSize - newPos;
                    newPos = 0;
                }
                else if (-newPos + sb.dragSize > sb.trackSize) {
                    newSize = sb.trackSize + newPos;
                }
            }
            else {
                if (newPos < 0) {
                    newSize = sb.dragSize + newPos;
                    newPos = 0;
                }
                else if (newPos + sb.dragSize > sb.trackSize) {
                    newSize = sb.trackSize - newPos;
                }
            }
            if (isH()) {
                sb.drag.transform('translate3d(' + (newPos) + 'px, 0, 0)');
                sb.drag[0].style.width = newSize + 'px';
            }
            else {
                sb.drag.transform('translate3d(0px, ' + (newPos) + 'px, 0)');
                sb.drag[0].style.height = newSize + 'px';
            }
            if (s.params.scrollbarHide) {
                clearTimeout(sb.timeout);
                sb.track[0].style.opacity = 1;
                sb.timeout = setTimeout(function () {
                    sb.track[0].style.opacity = 0;
                    sb.track.transition(400);
                }, 1000);
            }
        },
        setTransition: function (duration) {
            if (!s.params.scrollbar) return;
            s.scrollbar.drag.transition(duration);
        }
    };

    /*=========================
      Controller
      ===========================*/
    s.controller = {
        setTranslate: function (translate, byController) {
            var controlled = s.params.control;
            var multiplier, controlledTranslate;
            if (s.isArray(controlled)) {
                for (var i = 0; i < controlled.length; i++) {
                    if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
                        translate = controlled[i].rtl && controlled[i].params.direction === 'horizontal' ? -s.translate : s.translate;
                        multiplier = (controlled[i].maxTranslate() - controlled[i].minTranslate()) / (s.maxTranslate() - s.minTranslate());
                        controlledTranslate = (translate - s.minTranslate()) * multiplier + controlled[i].minTranslate();
                        if (s.params.controlInverse) {
                            controlledTranslate = controlled[i].maxTranslate() - controlledTranslate;
                        }
                        controlled[i].updateProgress(controlledTranslate);
                        controlled[i].setWrapperTranslate(controlledTranslate, false, s);
                        controlled[i].updateActiveIndex();
                    }
                }
            }
            else if (controlled instanceof Swiper && byController !== controlled) {
                translate = controlled.rtl && controlled.params.direction === 'horizontal' ? -s.translate : s.translate;
                multiplier = (controlled.maxTranslate() - controlled.minTranslate()) / (s.maxTranslate() - s.minTranslate());
                controlledTranslate = (translate - s.minTranslate()) * multiplier + controlled.minTranslate();
                if (s.params.controlInverse) {
                    controlledTranslate = controlled.maxTranslate() - controlledTranslate;
                }
                controlled.updateProgress(controlledTranslate);
                controlled.setWrapperTranslate(controlledTranslate, false, s);
                controlled.updateActiveIndex();
            }
        },
        setTransition: function (duration, byController) {
            var controlled = s.params.control;
            if (s.isArray(controlled)) {
                for (var i = 0; i < controlled.length; i++) {
                    if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
                        controlled[i].setWrapperTransition(duration, s);
                    }
                }
            }
            else if (controlled instanceof Swiper && byController !== controlled) {
                controlled.setWrapperTransition(duration, s);
            }
        }
    };

    /*=========================
      Init/Destroy
      ===========================*/
    s.init = function () {
        if (s.params.loop) s.createLoop();
        s.updateContainerSize();
        s.updateSlidesSize();
        s.updatePagination();
        if (s.params.scrollbar && s.scrollbar) {
            s.scrollbar.init();
        }
        if (s.params.effect !== 'slide' && s.effects[s.params.effect]) {
            if (!s.params.loop) s.updateProgress();
            s.effects[s.params.effect].setTranslate();
        }
        if (s.params.loop) {
            s.slideTo(s.params.initialSlide + s.loopedSlides, 0, false);
        }
        else {
            s.slideTo(s.params.initialSlide, 0, false);
        }
        s.attachEvents();
        if (s.params.observer && s.support.observer) {
            s.initObservers();
        }
        if (s.params.updateOnImagesReady) {
            s.preloadImages();
        }
        if (s.params.autoplay) {
            s.startAutoplay();
        }
        if (s.params.keyboardControl) {
            if (s.enableKeyboardControl) s.enableKeyboardControl();
        }
        if (s.params.mousewheelControl) {
            if (s.enableMousewheelControl) s.enableMousewheelControl();
        }
        if (s.params.hashnav) {
            if (s.hashnav) s.hashnav.init();
        }
    };
    
    // Destroy
    s.destroy = function (deleteInstance) {
        s.detachEvents();
        s.disconnectObservers();
        if (s.params.keyboardControl) {
            if (s.disableKeyboard) s.disableKeyboard();
        }
        if (s.params.mousewheelControl) {
            if (s.disableMousewheel) s.disableMousewheel();
        }
        if (s.params.onDestroy) s.params.onDestroy();
        if (deleteInstance !== false) s = null;
    };
    
    s.init();
    
    

    
    // Return swiper instance
    return s;
};

/*==================================================
    Prototype
====================================================*/
Swiper.prototype = {
    isSafari: (function () {
        var ua = navigator.userAgent.toLowerCase();
        return (ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0);
    })(),
    isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent),
    isArray: function (arr) {
        return Object.prototype.toString.apply(arr) === '[object Array]';
    },
    /*==================================================
    Feature Detection
    ====================================================*/
    support: {
        touch : (window.Modernizr && Modernizr.touch === true) || (function () {
            return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
        })(),

        transforms3d : (window.Modernizr && Modernizr.csstransforms3d === true) || (function () {
            var div = document.createElement('div').style;
            return ('webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div);
        })(),

        flexbox: (function () {
            var div = document.createElement('div').style;
            var styles = ('WebkitBox msFlexbox MsFlexbox WebkitFlex MozBox fles').split(' ');
            for (var i = 0; i < styles.length; i++) {
                if (styles[i] in div) return true;
            }
        })(),

        observer: (function () {
            return ('MutationObserver' in window || 'WebkitMutationObserver' in window);
        })()
    },
};