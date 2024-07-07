document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const despDiv = document.querySelector(".Desp");
    const navLinks = document.querySelectorAll(".navDes a");

    const handleResize = () => {
        if (window.innerWidth >= 769) {
            menuToggle.checked = false;
            despDiv.style.display = "none";
        }
    };

    menuToggle.addEventListener("change", () => {
        if (menuToggle.checked) {
            despDiv.style.display = "block";
        } else {
            despDiv.style.display = "none";
        }
    });

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            menuToggle.checked = false;
            despDiv.style.display = "none";
        });
    });

    window.addEventListener("resize", handleResize);
    handleResize(); // Llamar a handleResize al cargar la página

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            link.style.backgroundColor = "yellow";
            setTimeout(() => {
                link.style.backgroundColor = "";
            }, 100);
        });
    });
});

window.addEventListener('scroll', function() {

    const scrollIndicator = document.querySelector('.Scroll');
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    if (scrollTop > 0 && scrollTop < scrollHeight) {
        scrollIndicator.style.opacity = 1;
        console.log("holaaaa");
    } else {
        scrollIndicator.style.opacity = 0;
        console.log("adios");
    }
});
