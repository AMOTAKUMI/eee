(function () {
    'use strict';

    var cnt = '.content';
    var mdl = '.modal';
    var mdl_close = '.modal__close';
    var pj = '.project';
    var pj_item = '.project__item';
    var ax = '.axis';
    var ax_in = '.axis__in';
    var ax_in_x = '.axis__in__x';
    var ax_in_y = '.axis__in__y';
    var ax_xp = '.axis__x_plus';
    var ax_xm = '.axis__x_minus';
    var ax_new = '.js-new';
    var ax_up = '.js-up';
    var ax_down = '.js-down';
    var ax_delete = '.js-delete';
    var ax_download = '.js-download';
    var ax_help = '.js-help';
    var ax_el = '<li class="project__item is-current"><div class="axis"><div class="axis__y_plus"><input maxlength="20" placeholder="Y+ (only 20 letters)" type="text"></div><div class="axis__y_minus"><input maxlength="20" placeholder="Y- (only 20 letters)" type="text"></div><div class="axis__x_plus"><input maxlength="20" placeholder="X+ (only 20 letters)" type="text"></div><div class="axis__x_minus"><input maxlength="20" placeholder="X- (only 20 letters)" type="text"></div><div class="axis__theme"><input placeholder="Theme" type="text"></div><div class="axis__in"></div></div></li>';
    var memos = [];
    var memo = '.memo';
    var memo_textarea = '.memo　textarea';
    var memo_p = '.js-memo_plus';
    var memo_m = '.js-memo_minus';
    var memo_d = '.js-memo_delete';
    var x;
    var y;
    var rag = true;

    $(function () {
      window.EEE = new EEE();
    });

    var EEE = function() {
        this.init();
    }

    EEE.prototype.init = function () {
      this.intro();
      this.cookieSet();
      this.xSet();
      this.currentSet();
      this.newAxis();
      this.upAxis();
      this.downAxis();
      this.deleteAxis();
      this.help();
      this.modalClose();
      this.shortcuts();
      this.mousePoint();
    };

    EEE.prototype.intro = function () {
      var selected = $([]), offset = {top:0, left:0};
      $(memo).draggable({
        containment: ax_in,
        start: function(ev, ui) {
            $(this).css('left',parseInt($(this).css('left')) + 'px');
            $(this).css('top', parseInt($(this).css('top')) + 'px');
          if ($(this).hasClass("ui-selected")){
            selected = $(".ui-selected").each(function() {
              var el = $(this);
              el.data("offset", el.offset());
            });
          }
          else {
            selected = $([]);
            $(memo).removeClass("ui-selected");
          }
          offset = $(this).offset();
        },
        drag: function(ev, ui) {
          var dt = ui.position.top - offset.top, dl = ui.position.left - offset.left;
          selected.not(this).each(function() {
            var el = $(this), off = el.data("offset");
            el.css({top: off.top + dt, left: off.left + dl});
          });
        },
        stop: function(ev, ui) {
          $(this).css('left',(parseInt($(this).css('left')) / $(this).parent(ax_in).width()) * 100 + '%');
          $(this).css('top', (parseInt($(this).css('top')) / $(this).parent(ax_in).height()) * 100 + '%');
          var dt = ui.position.top - offset.top, dl = ui.position.left - offset.left;
          selected.not(this).each(function() {
            var el = $(this), off = el.data("offset");
            el.css('left',(parseInt(off.left + dl) / $(this).parent(ax_in).width()) * 100 + '%');
            el.css('top', (parseInt(off.top + dt) / $(this).parent(ax_in).height()) * 100 + '%');
          });
        }
      });
      $(ax_in).selectable({ filter: memo });
      $(memo).on('click',function(e){
        if (e.metaKey == false) {
          $(memo).removeClass("ui-selected");
          $(this).addClass("ui-selecting");
        } else {
          if ($(this).hasClass("ui-selected")) $(this).removeClass("ui-selected");
          else $(this).addClass("ui-selecting");
        }
      });
    };

    EEE.prototype.cookieSet = function () {
      if(!Cookies.get('firstVisit1')){
          Cookies.set('firstVisit1',{expires:7});
          $(mdl).toggleClass('is-active');
      }
    };

    EEE.prototype.xSet = function () {
      $(ax).each(function(i) {
        var h = $(this).outerHeight();
        $(this).find(ax_xp).css('width', h+'px');
        $(this).find(ax_xm).css('width', h+'px');
      });
      $(window).resize(function() {
        $(ax).each(function(i) {
          var h = $(this).outerHeight();
          $(this).find(ax_xp).css('width', h+'px');
          $(this).find(ax_xm).css('width', h+'px');
        });
      });
    };

    EEE.prototype.currentSet = function () {
      $(pj_item).removeClass('is-prev is-next1 is-next2 is-next3 is-next4');
      $('.is-current').prevAll().addClass('is-prev');
      for(var i=0 ; i<6 ; i++){
        $('.is-current').nextAll().eq(i).addClass('is-next' + (i + 1));
      }
    };

    EEE.prototype.newMemo = function () {
      if(rag){
        rag = false;
        memos.push(new MEMO(memos.length));
        var length = memos.length-1;
        $('[data-memo="' + length + '"]').css('left',(x / $('[data-memo="' + length + '"]').parent(ax_in).width()) * 100 + '%');
        $('[data-memo="' + length + '"]').css('top', (y / $('[data-memo="' + length + '"]').parent(ax_in).height()) * 100 + '%');
        $('[data-memo="' + length + '"]').addClass('is-new');

        var selected = $([]), offset = {top:0, left:0};
        $(memo).draggable({
          containment: ax_in,
          start: function(ev, ui) {
              $(this).css('left',parseInt($(this).css('left')) + 'px');
              $(this).css('top', parseInt($(this).css('top')) + 'px');
            if ($(this).hasClass("ui-selected")){
              selected = $(".ui-selected").each(function() {
                var el = $(this);
                el.data("offset", el.offset());
              });
            }
            else {
              selected = $([]);
              $(memo).removeClass("ui-selected");
            }
            offset = $(this).offset();
          },
          drag: function(ev, ui) {
            var dt = ui.position.top - offset.top, dl = ui.position.left - offset.left;
            selected.not(this).each(function() {
              var el = $(this), off = el.data("offset");
              el.css({top: off.top + dt, left: off.left + dl});
            });
          },
          stop: function(ev, ui) {
            $(this).css('left',(parseInt($(this).css('left')) / $(this).parent(ax_in).width()) * 100 + '%');
            $(this).css('top', (parseInt($(this).css('top')) / $(this).parent(ax_in).height()) * 100 + '%');
            var dt = ui.position.top - offset.top, dl = ui.position.left - offset.left;
            selected.not(this).each(function() {
              var el = $(this), off = el.data("offset");
              el.css('left',(parseInt(off.left + dl) / $(this).parent(ax_in).width()) * 100 + '%');
              el.css('top', (parseInt(off.top + dt) / $(this).parent(ax_in).height()) * 100 + '%');
            });
          }
        });
        $(ax_in).selectable({ filter: memo });
        $(memo).on('click',function(e){
          if (e.metaKey == false) {
            $(memo).removeClass("ui-selected");
            $(this).addClass("ui-selecting");
          } else {
            if ($(this).hasClass("ui-selected")) $(this).removeClass("ui-selected");
            else $(this).addClass("ui-selecting");
          }
        });

        setTimeout(function(){
          rag = true;
        },200);
      }
    };

    EEE.prototype.deleteMemo = function () {
      $(memo　+ '.ui-selected').each(function(i) {
        $(this).find(memo_d).trigger("click");
      });
      $(memo　+ '.ui-selecting').each(function(i) {
        $(this).find(memo_d).trigger("click");
      });
    };

    EEE.prototype.newAxis = function () {
      var that = this;
      $(ax_new).on('click',function(){
        if($(pj_item).length < 5){
          $('.is-current').removeClass('is-current').before(ax_el);
          that.currentSet();
          that.mousePoint();
          that.xSet();
          setTimeout(that.xSet,1000);
        }
      });
    };

    EEE.prototype.upAxis = function () {
      var that = this;
      $(ax_up).on('click',function(){
        if(!$('.is-current').is(":first-child")){
          $('.is-current').removeClass('is-current').prev().addClass('is-current');
          that.currentSet();
          that.mousePoint();
          that.xSet();
          setTimeout(that.xSet,1000);
        }
      });
    };

    EEE.prototype.downAxis = function () {
      var that = this;
      $(ax_down).on('click',function(){
        if(!$('.is-current').is(":last-child")){
          $('.is-current').removeClass('is-current').next().addClass('is-current');
          that.currentSet();
          that.mousePoint();
          that.xSet();
          setTimeout(that.xSet,1000);
        }
      });
    };

    EEE.prototype.deleteAxis = function () {
      $(ax_delete).on('click',function(){
        $('.is-current').find(memo).each(function(i) {
          $(this).find(memo_d).trigger("click");
        });
      });
    };

    EEE.prototype.help = function () {
      $(ax_help).on('click',function(){
        $(mdl).toggleClass('is-active');
      });
    };

    EEE.prototype.modalClose = function () {
      $(mdl_close).on('click',function(){
        $(mdl).toggleClass('is-active');
      });
    };

    EEE.prototype.shortcuts = function () {
      var that = this;
      shortcut.add('Shift+Delete',that.deleteMemo);
      shortcut.add('Shift+Backspace',that.deleteMemo);
      shortcut.add('Shift+Space',that.newMemo);
    };

    EEE.prototype.mousePoint = function () {
      $('.is-current').find(ax_in).on('mousemove',function(e){
        x = e.offsetX;
        y = e.offsetY;
      });
    };

    var MEMO = function(num,dammy) {
        this.fz = 16;
        this.num = num;
        this.el = '<div class="memo clearfix" data-memo="' + this.num + '"><ul><li class="js-memo_plus"><i class="fa fa-plus" aria-hidden="true"></i></li><li class="js-memo_minus"><i class="fa fa-minus" aria-hidden="true"></i></li><li class="js-memo_delete"><i class="fa fa-times" aria-hidden="true"></i></li></ul><textarea placeholder="text"></textarea></div>';
        this.dammy = dammy;
        this.init(this.dammy);
    }

    MEMO.prototype.init = function (dammy) {
      if(!dammy)$('.is-current').find(ax_in).append(this.el);
      this.textareaResize();
      this.plusMemo();
      this.minusMemo();
      this.deleteMemo();
    };

    MEMO.prototype.textareaResize = function () {
      $(memo).find('textarea').on("keydown",function(evt){
        if(evt.target.scrollHeight > evt.target.offsetHeight){
          $(evt.target).height(evt.target.scrollHeight);
        }else{
          var lineHeight = Number($(evt.target).css("lineHeight").split("px")[0]);
          while (true){
            $(evt.target).height($(evt.target).height() - lineHeight);
            if(evt.target.scrollHeight > evt.target.offsetHeight){
              $(evt.target).height(evt.target.scrollHeight);
              break;
            }
          }
        }
      });
    };

    MEMO.prototype.plusMemo = function () {
      $(memo_p).off('click');
      $(memo_p).on('click',function(){
        var num = $(this).parents(memo).attr('data-memo');
        if(memos[num].fz < 29) memos[num].fz += 1;
        $(this).parent().next().css('font-size', memos[num].fz + 'px');
      });
    };

    MEMO.prototype.minusMemo = function () {
      $(memo_m).off('click');
      $(memo_m).on('click',function(){
        var num = $(this).parents(memo).attr('data-memo');
        if(memos[num].fz > 9) memos[num].fz -= 1;
        $(this).parent().next().css('font-size', memos[num].fz + 'px');
      });
    };

    MEMO.prototype.deleteMemo = function () {
      $(memo_d).off('click');
      $(memo_d).on('click',function(){
        var that = this;
        var num = $(that).parents(memo).attr('data-memo');
        $(that).parents(memo).addClass('is-delete');
        setTimeout(function(){
          $(that).parents(memo).remove();
          delete memos[num];
        },1000);
      });
    };

})();
