// =====================================================
// NAVIGATION
// =====================================================

const navLinks = document.querySelectorAll("nav a");
const sections = document.querySelectorAll("section");


// =====================================================
// SMOOTH SCROLLING
// =====================================================

navLinks.forEach(link => {

    link.addEventListener("click", function(e) {

        e.preventDefault();

        const target = document.querySelector(
            this.getAttribute("href")
        );

        if (target) {

            target.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});


// =====================================================
// ACTIVE NAVIGATION
// =====================================================

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 200;

        const sectionHeight =
            section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {

            current = section.getAttribute("id");

        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            "#" + current
        ) {

            link.classList.add("active");

        }

    });

});


// =====================================================
// DOWNLOAD RESUME
// =====================================================

const resumeBtn =
    document.getElementById("resumeBtn");

if (resumeBtn) {

    resumeBtn.addEventListener("click", () => {

        const link =
            document.createElement("a");

        link.href =
            "DOMNIC_GABRIEL_ESCALANTE_Resume.pdf";

        link.download =
            "DOMNIC_GABRIEL_ESCALANTE_Resume.pdf";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

    });

}


// =====================================================
// SECTION FADE-IN ANIMATION
// =====================================================

const observer =
    new IntersectionObserver(

        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                }

            });

        },

        {
            threshold: 0.15
        }

    );


sections.forEach(section => {

    observer.observe(section);

});


// =====================================================
// CERTIFICATE LIGHTBOX
// =====================================================

const certificateModal =
    document.getElementById("certificateModal");

const certificateModalImage =
    document.getElementById("certificateModalImage");


// =====================================================
// OPEN CERTIFICATE
// =====================================================

function openCertificate(imageSrc) {

    if (!certificateModal || !certificateModalImage) {
        return;
    }

    certificateModalImage.src = imageSrc;

    certificateModal.classList.add("active");

    document.body.style.overflow = "hidden";

}


// =====================================================
// CLOSE CERTIFICATE
// =====================================================

function closeCertificate() {

    if (!certificateModal) {
        return;
    }

    certificateModal.classList.remove("active");

    document.body.style.overflow = "";

}


// =====================================================
// CLOSE WHEN CLICKING OUTSIDE IMAGE
// =====================================================

if (certificateModal) {

    certificateModal.addEventListener(
        "click",
        function(e) {

            if (e.target === certificateModal) {

                closeCertificate();

            }

        }
    );

}


// =====================================================
// CLOSE WITH ESC KEY
// =====================================================

document.addEventListener("keydown", function(e) {

    if (e.key === "Escape") {

        closeCertificate();

    }

});


 // =====================================================
// PROJECT CARD NAVIGATION
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const projectCards = document.querySelectorAll(".project");

    const projectPages = [
        "projects/metroidvania.html",
        "projects/techstore.html",
        "projects/flappybird.html",
        "projects/ticketingSystem.html",
        "projects/bargainApp.html"
    ];

    projectCards.forEach((project, index) => {

        project.style.cursor = "pointer";

        project.addEventListener("click", function (event) {

            // Allow GitHub links to work normally
            if (event.target.closest("a")) {
                return;
            }

            if (projectPages[index]) {
                window.location.href = projectPages[index];
            }

        });

    });

});
