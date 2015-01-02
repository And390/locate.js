locate.js
=========

Locate.js allows you simply position HTML elements by directly set element coordinates.
It sets `position: absolute`, `left`, `top`, `width`, `height` CSS styles, and does missing work.
The idea is that you can control layout using javascript
without complex messy CSS like `float`, `min-width`, `inline-block` and other.

To use it you need link locate.js:
```html
<script type="text/javascript" src="locate.js"></script>
```
and run it on the page (at the bottom or more properly in the onload event)
```html
<script type="tex/javascript">
    window.onload = function()  {
        locate.process();
    }
</script>
```
(see advanced initialization code with resize event processing at example.js)

Example usage for center layer on the page:
```html
<div id="panel" locate="w=100; h=100; x=parent.w/2-w/2; y=parent.h/2-h/2;">
    ...
</div>
```

In this examples locate.js process all elements on document body.
You can specify need element as argument to function:
```html
<div id="container">
    <div locate="...">
        <img locate="..." ...>
        <span locate="...">...</div>
        ...
    </div>
    <div locate="">
        ...
    </div>
</div>
<script type="tex/javascript">
    locate.process("container");  // or locate.process(document.getElementById("container"));
    // without parameter it works same as you pass locate.process(document.body);
</script>
```

It processes all elements recursively. If you want to save browser layout unchanged for some elements
you should specify `nolocatechilds` attribute:
```html
<div id="container">
    <div locate="...">
        <table nolocatechilds>
            ...
        </table>
    </div>
</div>
```
It's already doesn't processes childs for `table`, `select` and some other tags,
also for elements, that contains text (text nodes). So `nolocatechilds` is unnecessary in last example.
There are also less useable `nolocate` attribute, that specifies to ignore element by `locate.process`.

It correctly works with `margin`, `padding`, `border` and `border-box` styles.
Sometimes it may be useful to combine `locate` with this styles, but Locate.js is purposed to avoid position styles.
With Locate.js you can do everything that you can do with `margin` and `padding`.
And often you can set indentations more clearly, using javascript constants, for example.