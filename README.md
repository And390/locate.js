locate.js
=========

Locate.js allows you to simply position HTML elements by directly setting the element coordinates.
It sets `position: absolute`, `left`, `top`, `width`, `height` CSS styles, and does missing work.
The idea is that you can control layout using javascript
without involved CSS like `float`, `min-width`, `inline-block` and other.

To use it you need to link locate.js:
```html
<script type="text/javascript" src="locate.js"></script>
```
and run it on the page (at the bottom or more properly in the onload event)
```html
<script type="text/javascript">
    window.onload = function()  {
        locate.process();
    }
</script>
```
(see advanced initialization code with resize event processing at example.js)

Example usage for center layer on the page:
```html
<div id="panel" locate="w=100; h=100; x=parent.iw/2-w/2; y=parent.ih/2-h/2;">
    ...
</div>
```
`locate.process` iterates all DOM elements and processes `locate` attribute values where you can write javascript
that sets `x`, `y`, `w`, `h` properties of the element (`this` also refers to the element).
After processing each element it calculates and sets position styles depending on `x`, `y`, `w`, `h` properties.
Before processing the `locate` attribute it sets `parent` as equivalent for `parentNode`,
`prev` to previous not ignored element (the similar `next` sets after processing),
`x` and `y` to zero, calculate `w` and `h` by content for a leaf elements
(that contain text or does not contain child elements) or set it to zero for other elements,
sets `r` (return `x+w`), `b` (return `y+h`) and other utility functions.
It also exists `iw` and `ih` properties which means inner dimensions of the element
and sets according to `w` and `h` whithout `margin`, `padding` and `border`.
After processing `locate` attribute it processes child elements.
If child right or bottom coordinates (`x+w`, `y+h`) greater than parent `iw` or `ih`,
than parent `w` or `h` expands.

You can process only necessary elements by specifing it as an argument for `locate.process`:
```html
<div id="container">
    <div locate="...">
        ...
    </div>
</div>
<script type="text/javascript">
    locate.process("container");  // or locate.process(document.getElementById("container"));
    locate.process("container2");  // etc.
    // without parameter locate.process works same as you pass locate.process(document.body);
</script>
```

It processes all elements recursively. If you want to save a browser layout unchanged for some elements
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
It doesn't process child elements for `table`, `select` and some other tags,
also for elements, that contains text (text nodes). So `nolocatechilds` is unnecessary in last example.
There are also less useable `nolocate` attribute, that specifies to ignore element by `locate.process`.

It correctly works with `margin`, `padding`, `border` and `border-box` styles.
Sometimes it may be useful to combine `locate` with this styles, but Locate.js is purposed to avoid position styles.
With Locate.js you can do everything that you can do with `margin` and `padding`.
And often you can set indentations more clearly, using javascript constants, for example.