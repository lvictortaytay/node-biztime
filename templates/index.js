window.addEventListener("load", function(){
    this.setTimeout(function(){
        let textHolder = document.getElementByTagName("span")
        textHolder.innertext = "hello"
    }, 1000)
})