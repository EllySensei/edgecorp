window.addEventListener("scroll", function() {
    const topBar = document.querySelector(".top-bar");
    if (window.scrollY > 10) { // Adjust threshold as needed
        topBar.classList.add("sticky");
    } else {
        topBar.classList.remove("sticky");
    }
});