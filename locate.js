(function(){


    this.locate =
    {
        process: process,
        getElement: getElement,
        getClientWidth: getClientWidth,
        getClientHeight: getClientHeight
    };


    function process(element)
    {
        if (element==undefined)  element = document.body;
        else  element = getElement(element);

        //    сам processLocate рекурсивно для всех детей
        for (var isNotComplete=true, iteration=1; isNotComplete; iteration++)
            isNotComplete = process_(element, iteration);
    }

    // эти тэги игнорируются, как будто их вообще нет
    var noLocateTags = this.locate.noLocateTags = {
        'SCRIPT': true,
        'STYLE': true,
        'BR': true,
        'HR': true,
        'WBR': true,
        'MAP': true,
        'DATALIST': true,
        'LEGENG': true
    };

    function needLocate(element)  {
        return !noLocateTags[element.tagName] && !element.hasAttribute("nolocate");
    }

    // у этих тэгов игнорируются дети (расположение остается таким, каким его оставит браузер)
    var noLocateChildsTags = this.locate.noLocateChildsTags = {
        'TABLE': true,
        'SELECT': true,
        'IFRAME': true,
        'OBJECT': true,
        'EMBDED': true,
        'APPLET': true,
        'AUDIO': true,
        'VIDEO': true,
        'CANVAS': true
    };
    // просто игнорируемые тэги тоже сюда входят
    for (var i in noLocateTags)  if (noLocateTags.hasOwnProperty(i))  noLocateChildsTags[i] = true;

    function canLocateChilds(element)  {
        return !(noLocateChildsTags[element.tagName] || element.hasAttribute("nolocatechilds") || element.hasAttribute("nolocate"))
    }

    function needLocateChilds(element)  {
        //    позиционировать детей, если содержит дочерние элементы и при этом не содержит текста за исключением пробелов
        var hasChildElements = false;
        for (var child=element.firstChild; child; child=child.nextSibling)
            if (child.nodeType==1)  hasChildElements = true;
            else if (child.nodeType==3)
                for (var i=0; i<child.nodeValue.length; i++)  if (child.nodeValue.charCodeAt(i)>32)  return false;
            else if (child.nodeType==5 || child.nodeType==6)  return false;  // html entities (&amp;), depricated
        return hasChildElements;
    }

    function process_(element, iteration)
    {
        var style = getComputedStyle(element, undefined);

        var canLocateChilds_ = canLocateChilds(element);
        var needLocateChilds_ = canLocateChilds_ ? needLocateChilds(element) : false;

        if (iteration==1)
        {
            //    добавить вспомогательные функции к эелементу, ели они еще не добавлены
            if (!element.applyWidth)  {
                element.leftW = function()  {  return parseInt(style.marginLeft) + parseInt(style.borderLeftWidth) + parseInt(style.paddingLeft);  };
                element.topH = function()  {  return parseInt(style.marginTop) + parseInt(style.borderTopWidth) + parseInt(style.paddingTop);  };
                element.rightW = function()  {  return parseInt(style.marginRight) + parseInt(style.borderRightWidth) + parseInt(style.paddingRight);  };
                element.bottomH = function()  {  return parseInt(style.marginBottom) + parseInt(style.borderBottomWidth) + parseInt(style.paddingBottom);  };
                element.leftInW = function()  {  return parseInt(style.borderLeftWidth) + parseInt(style.paddingLeft);  };
                element.topInH = function()  {  return parseInt(style.borderTopWidth) + parseInt(style.paddingTop);  };
                element.rightInW = function()  {  return parseInt(style.borderRightWidth) + parseInt(style.paddingRight);  };
                element.bottomInH = function()  {  return parseInt(style.borderBottomWidth) + parseInt(style.paddingBottom);  };
                element.subW = function()  {  return this.leftW() + this.rightW();  };
                element.subH = function()  {  return this.topH() + this.bottomH();  };
                element.applyLeft = function()  {  this.style.left = Math.floor(this.x+(this.parent ? this.parent.leftInW() : 0))+"px";  };
                element.applyTop = function()  {  this.style.top = Math.floor(this.y+(this.parent ? this.parent.topInH() : 0))+"px";  };
                element.applyWidth = function()  {  this.style.width = this.calcWidth();  };
                element.applyHeight = function()  {  this.style.height = this.calcHeight();  };
                element.calcWidth = function()  {
                    var result = this.w - (
                        style.boxSizing=="border-box" ? parseInt(style.marginLeft)+parseInt(style.marginRight) :
                        style.boxSizing=="padding-box" ? parseInt(style.marginLeft)+parseInt(style.marginRight)+parseInt(style.borderLeftWidth)+parseInt(style.borderRightWidth)
                        : this.subW());
                    //result = Math.floor(result);  //у хрома в стилях не целое количество пикселей
                    return (result>0 ? result : 0)+"px";
                };
                element.calcHeight = function()  {
                    var result = Math.floor(this.h - (
                        style.boxSizing=="border-box" ? parseInt(style.marginTop)+parseInt(style.marginBottom) :
                        style.boxSizing=="padding-box" ? parseInt(style.marginTop)+parseInt(style.marginBottom)+parseInt(style.borderTopWidth)+parseInt(style.borderBottomWidth)
                        : this.subH()));
                    return (result>0 ? result : 0)+"px";
                };
                //    utility for user
                element.r = function()  {  return this.x + this.w;  };
                element.b = function()  {  return this.y + this.h;  };
                element.alignLeft = function(el)  {  el=getElement(el);  this.x=el.x+el.leftW()-this.leftW();  };              //по внутренним границам элементов
                element.alignTop = function(el)  {  el=getElement(el);  this.y=el.y+el.topH()-this.topH();  };                 //по внутренним границам элементов
                element.alignRight = function(el)  {  el=getElement(el);  this.x=el.r()-el.rightW()+this.leftW()-this.w;  };   //по внутренним границам элементов
                element.alignBottom = function(el)  {  el=getElement(el);  this.y=el.b()-el.bottomH()+this.topH()-this.h;  };  //по внутренним границам элементов
                element.alignCenter = function(el)  {  el=getElement(el);  this.x=el.x+(el.w+el.leftW()-el.rightW())/2-(this.w+this.leftW()-this.rightW())/2;  };  //по внутренним границам элементов
                element.alignMiddle = function(el)  {  el=getElement(el);  this.y=el.y+(el.h+el.topH()-el.bottomH())/2-(this.h+this.topH()-this.bottomH())/2;  };  //по внутренним границам элементов
                //TODO align baseline
                element.calcHbyW = function()  {  this.applyWidth();  var box = element.getBoundingClientRect();  this.h = (box.bottom-box.top) + parseInt(style.marginTop) + parseInt(style.marginBottom);  this.ih = this.h - this.subH();  }
            }

            //    установить начальные значения
            element.style.position = element.parent ? "absolute" : "relative";  //для корректного расчета начальных размеров элементов у их родителей уже должен быть установлен position
            element.x = 0;
            element.y = 0;
            //    для body установить размеры оконной области
            if (element==document.body)  {
                element.w = getClientWidth();
                element.h = getClientHeight();
                element.iw = element.w - element.subW();
                element.ih = element.h - element.subH();
            }
            // для iframe попробовать обработать атрибуты width и height
            else if (element.tagName=="IFRAME" && parseInt(element.width) && parseInt(element.height))  {
                element.w = parseInt(element.width);
                element.h = parseInt(element.height);
                element.iw = element.w - element.subW();
                element.ih = element.h - element.subH();
            }
            //    если нужно расположить потомков, то инициализировать нулевые размеры
            else if (needLocateChilds_)  {
                element.iw = 0;
                element.ih = 0;
                element.w = element.iw + element.subW();
                element.h = element.ih + element.subH();
            }
            //    иначе посчитать посчитать размеры, установленные браузером
            else  {
                element.style.width = "auto";
                element.style.height = "auto";
                // установить nowrap, если white-space установлен в normal (например, отличается для тега pre)
                var oldWhiteSpace = undefined;
                if (canLocateChilds_ && style.whiteSpace=="normal")  {
                    oldWhiteSpace = element.style.whiteSpace;
                    element.style.whiteSpace = "nowrap";
                }
                var box = element.getBoundingClientRect();
                element.w = (box.right-box.left) + parseInt(style.marginLeft) + parseInt(style.marginRight);
                element.h = (box.bottom-box.top) + parseInt(style.marginTop) + parseInt(style.marginBottom);
                element.iw = element.w - element.subW();
                element.ih = element.h - element.subH();
                // вернуть white-space
                if (oldWhiteSpace!==undefined)  element.style.whiteSpace = oldWhiteSpace;
            }
        }

        //    process locate
        var locate = element.getAttribute(iteration==1 ? "locate" : "locate"+iteration);
        if (locate)  {
            safeEval.call(element, locate, element);
            element.iw = element.w - element.subW();
            element.ih = element.h - element.subH();
        }

        //    process childs
        var result = false;
        var childPrev = undefined;
        if (needLocateChilds_)
            for (var i=0; i<element.children.length; i++)
            {
                var child = element.children[i];
                if (!needLocate(child))  continue;
                child.parent = element;
                child.prev = childPrev;
                if (childPrev!==undefined)  childPrev.next = child;
                else  element.child = child;
                childPrev = child;
                result = process_(child, iteration) || result;
                if (child.r()>element.iw)  {  element.iw = child.r();  element.w = element.iw + element.subW();  }
                if (child.b()>element.ih)  {  element.ih = child.b();  element.h = element.ih + element.subH();  }
            }

        //    set element styles
        element.applyLeft();
        element.applyTop();
        element.applyWidth();
        element.applyHeight();

        return result || (element.getAttribute("locate"+(iteration+1))!=null);
    }


    //                --------    utility    --------

    //если пользоваться обычным eval, то из выполняемого скрипта видны все переменные функции из которой вызван eval!
    function safeEval(script, object)
    {
        if (object!=undefined)  with (object)  {  return eval(script);  }
        else  return eval(script);
    }

    // принимает id элемента или сам элемент и возвращает его
    function getElement(element)  {
        if (Object.prototype.toString.call(element).slice(8, -1)=="String")  {
            var elementId=element;  element = document.getElementById(elementId);
            if (element===null)  throw "Element not found: "+elementId;
        }
        else if (!isElement(element))  throw "Element or ElementID expected but found: "+element;
        return element;
    }

    // returns true if it is a DOM element (from http://stackoverflow.com/a/384380)
    function isElement(o)  {
        return  typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
            o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string";
    }

    // window client size without scrollbars (if possible to detect)
    function getClientWidth()  {
        return document.documentElement.clientWidth || document.body.clientWidth;
    }

    function getClientHeight()  {
        return document.documentElement.clientHeight || document.body.clientHeight;
    }

    //    not used now
    //    если элемент содержит вперемешку текст и дочерние элементы, то оборачивает текст в span-ы
    function wrapTextWithSpan(element)
    {
        var ti = -1;  // индекс первого текстового узла из группы, которую надо обернуть
        var hasElements = false;  //есть ли дочерние элементы (без них ничего оборачивать не надо)
        for (var i=0; ; i++)  {
            if (i===element.childNodes.length || element.childNodes[i].nodeType==1)  {  //конец или элемент
                if (i!==element.childNodes.length)  hasElements = true;
                //    если надо, обернуть узлы с ti по i
                if (hasElements && ti!=-1)  {
                    var span = document.createElement("span");
                    for (; i!=ti; i--)  span.appendChild(element.childNodes[ti]);  //элементы удаляются из element.childNodes
                    element.insertBefore(span, element.childNodes[i]);  //и заменяются на span
                    i++;
                    ti=-1;
                }
                //    достигли конца - выход
                if (i===element.childNodes.length)  break;
                //    рекурсивная обработка
                if (needLocateChilds(element.childNodes[i]))
                    wrapTextWithSpan(element.childNodes[i]);
            }
            else if (element.childNodes[i].nodeType==3)  {  // текст
                //    запомнить элемент для оборачивания, если текст содержит непробельные символы
                if (ti==-1)  {
                    var text = element.childNodes[i].nodeValue;
                    for (var p1=0; p1!=text.length; p1++)  if (text.charCodeAt(p1)>32)  {  ti=i;  break;  }
                }
            }
            else if (element.childNodes[i].nodeType==5 || element.childNodes[i].nodeType==6)  {  // html entities (&amp;), depricated
                if (ti==-1)  ti=i;
            }
            // остальные типы, комментарии, CDATA и прочие, остаются как есть
        }
    }

})();