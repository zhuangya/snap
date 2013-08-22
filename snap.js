(function() {
  // 兼容版本的 Event Delegation 封装
  // 散束依次是 要绑定事件的对象 (delegator) ，事件，回调函数，和是否捕获
  function addEvent(obj, event, fn, capture) {
    if(window.attachEvent) {
      obj.attachEvent('on' + event, fn);
    } else {
      if(!capture) capture = false;
      obj.addEventListener(event, fn, capture);
    }
  }

  // 兼容版本的取得浏览器窗口大小的方法
  function getBrowserSize() {
    var myWidth = 0, myHeight = 0;
    if( typeof( window.innerWidth ) == 'number' ) {
      //Non-IE
      myWidth = window.innerWidth;
      myHeight = window.innerHeight;
    } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
      //IE 6+ in 'standards compliant mode'
      myWidth = document.documentElement.clientWidth;
      myHeight = document.documentElement.clientHeight;
    } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
      //IE 4 compatible
      myWidth = document.body.clientWidth;
      myHeight = document.body.clientHeight;
    }
    return {
      'width': myWidth,
      'height': myHeight
    };
  }

  var generator = function(params) {
    var width = +params.width || 350;
    var height = +params.height || 320;
    var img = params.img;
    var href = params.href;
    var position = params.position || 'bottom-right';

    // 这里接受的条件是形如： `bottom-left`, `bottrom-right` 的字符串，中间用 dash 分隔
    // 如果需要指定在页面垂直居中，则请把 `middle` 写在后面，比如: `left-middle`

    function parsePosition(position) {
      return position.replace(/(\w+)-(\w+)/, function(match, pos1, pos2) {
        if(pos2 === 'middle') {
          var top = (((getBrowserSize().height - height) / 2) >>> 0) + 'px';
          return pos1 + ': 0; top :' + top + ';';
        }
        return pos1 + ': 0; ' + pos2 + ': 0;';
      });
    }

    // 模板
    var __template = [
      '<style>',
      '.survey-recruit { position: fixed;' + parsePosition(position) + ' width:' + width + 'px; height:' + height + 'px; }',
      '.survey-recruit-close { cursor: pointer; position: absolute; top: 0; right: 0; font-size: 24px; }',
      '</style>',
      '<div class="survey-recruit">',
      '<div class="survey-recruit-close">&times;</div>',
      '<div class="survey-recruit-content">',
      '<a target="_blank" href="' + href + '"><img src="' + img + '" alt=""/></a>',
      '</div>',
      '</div>'
    ].join('');

    // 关闭按钮的事件绑定
    function bindClose() {
      var surveyRecruit = document.getElementsByClassName('survey-recruit')[0];
      addEvent(surveyRecruit, 'click', function(event) {
        this.parentElement.removeChild(this);
      });
    }

    // 插入 DOM 的方法
    function inject() {
      htmlString = __template;
      var wrapper = document.createElement('div');
      wrapper.className = 'survey-recruit';
      wrapper.innerHTML = htmlString;
      document.getElementsByTagName('body')[0].appendChild(wrapper);
      bindClose();
    }

    // when to inject
    if(window.attachEvent) {
      window.attachEvent('onload', inject);
    } else if(window.addEventListener) {
      window.addEventListener('load', inject, false);
    } else {
      document.addEventListener('load', inject, false);
    }

  };

  //change this la!
  generator({
    img: 'http://placekitten.com/350/320',
    href: 'http://baidu.com',
    position: 'right-middle'
  });
}());

