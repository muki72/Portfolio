const zaapy = document.getElementById("zaapy");
const diet = document.getElementById("diet");
const container = document.querySelector('.project-container');
const icons = container.querySelectorAll('.icon');


// switch entre les different projets
icons[0].addEventListener('click', () => {
    zaapy.style.display = "flex"
    diet.style.display = "none"
    console.log('Premier logo (Zaapy) cliqué');
});

icons[1].addEventListener('click', () => {
    diet.style.display = "flex"
    zaapy.style.display = "none"
    console.log('Deuxième logo (Lisa) cliqué');
});


//effet de slide in
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.slide-in');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // On ajoute un décalage progressif si plusieurs éléments entrent en vue en même temps
                setTimeout(() => {
                    entry.target.classList.add('show');
                }, index * 100);

                observer.unobserve(entry.target); // ne l'observe qu'une fois
            }
        });
    }, {
        threshold: 0.3
    });

    elements.forEach(el => observer.observe(el));
});



