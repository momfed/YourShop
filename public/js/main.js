$(function () {

    $( "#s-id" ).click(function() {
        setTimeout(function() { $('#respond-s').focus() }, 1);
    });

    $('.in').on('blur', function () {
        var div = $(this).attr('data-input');
        var name = $(this).attr('data-name');
        if($('#'+name).val().length === 0) {
            $('#'+div).addClass('has-error');
        }
    });
    $('.in').on('click', function () {
        var div = $(this).attr('data-input');
        if($('#'+div).hasClass('has-error')) {
            $('#'+div).removeClass('has-error');
        }
    });
    $('.selecting').on('click', function() {
        var name = $(this).attr('data-select');
        var option = $("#"+name).children().eq(0);
        option.prop('disabled', 'true');
    });
    $('.button-checkbox').each(function () {

        // Settings
        var $widget = $(this),
            $button = $widget.find('button'),
            $checkbox = $widget.find('input:checkbox'),
            color = $button.data('color'),
            settings = {
                on: {
                    icon: 'glyphicon glyphicon-check'
                },
                off: {
                    icon: 'glyphicon glyphicon-unchecked'
                }
            };

        // Event Handlers
        $button.on('click', function () {
            $checkbox.prop('checked', !$checkbox.is(':checked'));
            $checkbox.triggerHandler('change');
            updateDisplay();
            $('#acceptErr').addClass('hidden');
        });
        $checkbox.on('change', function () {
            updateDisplay();
        });

        // Actions
        function updateDisplay() {
            var isChecked = $checkbox.is(':checked');

            // Set the button's state
            $button.data('state', (isChecked) ? "on" : "off");

            // Set the button's icon
            $button.find('.state-icon')
                .removeClass()
                .addClass('state-icon ' + settings[$button.data('state')].icon);

            // Update the button's color
            if (isChecked) {
                $button
                    .removeClass('btn-default')
                    .addClass('btn-' + color + ' active');
            }
            else {
                $button
                    .removeClass('btn-' + color + ' active')
                    .addClass('btn-default');
            }
        }

        // Initialization
        function init() {

            updateDisplay();

            // Inject the icon if applicable
            if ($button.find('.state-icon').length === 0) {
                $button.prepend('<i class="state-icon ' + settings[$button.data('state')].icon + '"></i>');
            }
        }
        init();
    });

    //Validation

    $("#tel").keydown(function (e) {
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 return;
        }
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
    $('#tel').on('blur', function() {
        if ($(this).val().length < 10) {
            var telInput = $(this).attr('data-input');
            $('#'+telInput).addClass('has-error');
            $('#telErr').removeClass('hidden');
        }
    });
    $('#tel').on('click', function() {
        if ($('#telErr').not('hidden')) {
        $('#telErr').addClass('hidden');
    }
    });
    $('#form').on('submit', function() {
        if ($('#accept').hasClass('btn-default')) {
            $('#acceptErr').removeClass('hidden');
            return false;
        } if ($('#city').children('option').eq(0).is(':selected')) {
            $('#cityDiv').addClass('has-error');
            $('#cityErr').removeClass('hidden');
            return false;
        }if ($('#zone').children('option').eq(0).is(':selected')) {
            $('#zoneDiv').addClass('has-error');
            $('#zoneErr').removeClass('hidden');
            return false;
        } if ($('.input-group').hasClass('has-error') || $('.form-group').hasClass('has-error')) {
            $('#Err').removeClass('hidden');
            return false;
        } else {
            return true;
        }
    });
    $('#city').on('change', function() {
        if ($('#cityErr').not('hidden')) {
            $('#cityErr').addClass('hidden');
            $('#cityDiv').removeClass('has-error');
        }
    });
    $('#zone').on('change', function() {
        if ($('#zoneErr').not('hidden')) {
            $('#zoneErr').addClass('hidden');
            $('#zoneDiv').removeClass('has-error');
        }
    });
    $('#address').on('change', function() {
        $('#address option#newAddress').each(function() {
            if($(this).is(':selected')) {
                $('#newAddressDiv').removeClass('hidden');
            }
        });
    });
    

    $('.carousel-indicators').children().eq(0).addClass('active');
    $('.carousel-inner').children().eq(0).addClass('active');
    $('#in2').children().eq(0).addClass('active');

    //Function to animate slider captions 
    function doAnimations( elems ) {
        //Cache the animationend event in a variable
        var animEndEv = 'webkitAnimationEnd animationend';
        
        elems.each(function () {
            var $this = $(this),
                $animationType = $this.data('animation');
            $this.addClass($animationType).one(animEndEv, function () {
                $this.removeClass($animationType);
            });
        });
    }
    
    //Variables on page load 
    var $myCarousel = $('#carousel-example-generic'),
        $firstAnimatingElems = $myCarousel.find('.item:first').find("[data-animation ^= 'animated']");
        
    //Initialize carousel 
    $myCarousel.carousel();
    
    //Animate captions in first slide on page load 
    doAnimations($firstAnimatingElems);
    
    //Pause carousel  
    $myCarousel.carousel('pause');
    
    
    //Other slides to be animated on carousel slide event 
    $myCarousel.on('slide.bs.carousel', function (e) {
        var $animatingElems = $(e.relatedTarget).find("[data-animation ^= 'animated']");
        doAnimations($animatingElems);
    });  
    $('#carousel-example-generic').carousel({
        interval:2000,
        pause: "false"
    });

    $myCarousel.mouseover(function() {$('.commandIco').fadeIn(500)}).mouseleave(function() {$('.commandIco').fadeOut(500)});

    $('#itemslider').carousel({ interval: 3000 });
}());
$('.carousel-showmanymoveone .item').each(function(){
    var itemToClone = $(this);

    for (var i=1;i<6;i++) {
      itemToClone = itemToClone.next();


      if (!itemToClone.length) {
        itemToClone = $(this).siblings(':first');
      }


      itemToClone.children(':first-child').clone()
        .addClass("cloneditem-"+(i))
        .appendTo($(this));
    }
});