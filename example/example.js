
function relocate()  {
    console.log("locate");
    var width = locate.getClientWidth();
    var height = locate.getClientHeight();
    locate.process();
    // scrollbar can appear/disappear after process and chage the size, so it may need to locate again
    if (locate.getClientWidth()!=width || locate.getClientHeight()!=height)  {
        console.log("locate (second pass)");
        locate.process();
    }
}

//    process 'resize' with latency (in order to save performance)
var resizeTimeout = undefined;
window.addEventListener("resize", function ()  {
    if (resizeStartLockTimeout)  return;
    if (resizeTimeout)  {  clearTimeout(resizeTimeout);  }
    resizeTimeout = setTimeout(function ()  {
        resizeTimeout = undefined;
        relocate();
    }, 100);
});
//    forbid 'resize' at first 300ms (in some browsers it is possible unnecessary extra calls on page load)
var resizeStartLockTimeout = setTimeout(function() {  resizeStartLockTimeout=undefined;  }, 300);

//    locate on load
window.addEventListener("load", function ()  {
    relocate();
});

