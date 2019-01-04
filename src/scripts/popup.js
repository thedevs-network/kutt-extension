document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('text');
    link.addEventListener('click', function() {
        link.textContent = "Testing";
    });
});