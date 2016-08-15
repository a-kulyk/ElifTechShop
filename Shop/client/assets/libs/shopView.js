function makeVisualEffects() {
    $('.product').each(function (i, el) {
        var image = $(this).find('.main_inner img');
        if(image.prop('naturalHeight') > image.prop('naturalWidth')) {
            image.css({'width' : '100%'});

        }
        if(image.prop('naturalHeight') < image.prop('naturalWidth')) {
            image.css({'margin':'auto','min-height' : '120px','max-height':'140px','position': 'absolute',
            'left': '-50%',
                'right':'-50%',
                'margin-top':'-15px',
                'max-width':'none',
                'z-index':'0'

            });
           image.parent().css({
            'position': 'relative',
            'width': '100%'})
        }
        if(image.prop('naturalHeight') === image.prop('naturalWidth')) {
            console.log('square');
            image.css({'width' : '100%','height': '100%'});

        }


        // Lift card and show stats on Mouseover
        $(el).find('.make3D').hover(function () {
            $(this).parent().css('z-index', "20");
            $(this).addClass('animate');
            $(this).find('div.carouselNext, div.carouselPrev').addClass('visible');
        }, function () {
            $(this).removeClass('animate');
            $(this).parent().css('z-index', "1");
            $(this).find('div.carouselNext, div.carouselPrev').removeClass('visible');
        });

        // Flip card to the back side
        $(el).find('.view_gallery').click(function () {

            $(el).find('div.carouselNext, div.carouselPrev').removeClass('visible');
            $(el).find('.make3D').addClass('flip-10');
            setTimeout(function () {
                $(el).find('.make3D').removeClass('flip-10').addClass('flip90').find('div.shadow').show().fadeTo(80, 1, function () {
                    $(el).find('.product-front, .product-front div.shadow').hide();
                });
            }, 50);

            setTimeout(function () {
                $(el).find('.make3D').removeClass('flip90').addClass('flip190');
                $(el).find('.product-back').show().find('div.shadow').show().fadeTo(90, 0);
                setTimeout(function () {
                    $(el).find('.make3D').removeClass('flip190').addClass('flip180').find('div.shadow').hide();
                    setTimeout(function () {
                        $(el).find('.make3D').css('transition', '100ms ease-out');
                        $(el).find('.cx, .cy').addClass('s1');
                        setTimeout(function () {
                            $(el).find('.cx, .cy').addClass('s2');
                        }, 100);
                        setTimeout(function () {
                            $(el).find('.cx, .cy').addClass('s3');
                        }, 200);
                        $(el).find('div.carouselNext, div.carouselPrev').addClass('visible');
                    }, 100);
                }, 100);
            }, 150);
        });

        // Flip card back to the front side
        $(el).find('.flip-back').click(function () {

            $(el).find('.make3D').removeClass('flip180').addClass('flip190');
            setTimeout(function () {
                $(el).find('.make3D').removeClass('flip190').addClass('flip90');

                $(el).find('.product-back div.shadow').css('opacity', 0).fadeTo(100, 1, function () {
                    $(el).find('.product-back, .product-back div.shadow').hide();
                    $(el).find('.product-front, .product-front div.shadow').show();
                });
            }, 50);

            setTimeout(function () {
                $(el).find('.make3D').removeClass('flip90').addClass('flip-10');
                $(el).find('.product-front div.shadow').show().fadeTo(100, 0);
                setTimeout(function () {
                    $(el).find('.product-front div.shadow').hide();
                    $(el).find('.make3D').removeClass('flip-10').css('transition', '100ms ease-out');
                    $(el).find('.cx, .cy').removeClass('s1 s2 s3');
                }, 100);
            }, 150);

        });

        makeCarousel(el);
    });


    function makeCarousel(el) {


        var carousel = $(el).find('.carousel ul');
        var carouselSlideWidth = $('.product').width();
        $(window).resize(function () {
            carouselSlideWidth = $('.product').width();
        })

        var carouselWidth = 0;
        var isAnimating = false;
        var currSlide = 0;
        $(carousel).attr('rel', currSlide);

        // building the width of the casousel
        $(carousel).find('li').each(function () {
            carouselWidth += carouselSlideWidth;
            $(this).css({'width': carouselSlideWidth})

        });

        $(carousel).css('width', carouselWidth);
        $(window).resize(function () {
            carouselWidth = 0;
            $(carousel).find('li').each(function () {
                carouselWidth += carouselSlideWidth;
                $(this).css({'width': carouselSlideWidth})
            });
            $(carousel).css('width', carouselWidth);

        })

        // Load Next Image
        $(el).find('div.carouselNext').on('click', function () {

            var currentLeft = Math.abs(parseInt(currSlide * $('.product').width()));
            var newLeft = currentLeft + carouselSlideWidth;
            $(window).resize(function () {
                currentLeft = Math.abs(parseInt(currSlide * $('.product').width()));
                newLeft = currentLeft + carouselSlideWidth;
            });

            if (newLeft == carouselWidth || isAnimating === true) {
                return;
            }
            $(carousel).css({
                'left': "-" + newLeft + "px",
                "transition": "300ms ease-out"
            });
            $(window).resize(function () {
                $(carousel).css({
                    'left': "-" + newLeft + "px",
                    "transition": "300ms ease-out"
                });
            });
            isAnimating = true;
            currSlide++;
            $(carousel).attr('rel', currSlide);
            setTimeout(function () {
                isAnimating = false;
            }, 300);

        });

        // Load Previous Image
        $(el).find('div.carouselPrev').on('click', function () {
            var currentLeft = Math.abs(parseInt($(carousel).css("left")));
            var newLeft = currentLeft - carouselSlideWidth;

            if (newLeft < 0 || isAnimating === true) {
                return;
            }
            $(carousel).css({
                'left': "-" + newLeft + "px",
                "transition": "300ms ease-out"
            });
            isAnimating = true;
            currSlide--;
            $(carousel).attr('rel', currSlide);
            setTimeout(function () {
                isAnimating = false;
            }, 300);
        });
    }
}

