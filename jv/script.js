function search(event) {
    event.preventDefault(); // Voorkom standaard formulierverzending
    const query = document.getElementById('searchInput').value.toLowerCase();
    const resultsContainer = document.getElementById('searchResults');
    const searchables = document.querySelectorAll('.searchable');
    
    // Maak de resultatencontainer leeg
    resultsContainer.innerHTML = '';

    let found = false;

    searchables.forEach(item => {
        if (item.textContent.toLowerCase().includes(query) && query.length > 0) {
            found = true;
            const resultItem = document.createElement('div');
            resultItem.classList.add('search-result-item');
            resultItem.textContent = item.textContent;
            resultItem.onclick = () => {
                // Ga naar het item als je erop klikt
                alert('Je hebt geklikt op: ' + item.textContent);
            };
            resultsContainer.appendChild(resultItem);
        }
    });

    // Toon de resultaten als er iets is gevonden
    if (found) {
        resultsContainer.style.display = 'block';
    } else {
        resultsContainer.style.display = 'none';
    }
}
