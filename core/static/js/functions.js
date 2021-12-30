function doLogin() {
    window.location.href = "http://127.0.0.1:8000/admin/";
}

function doLogout() {
    window.location.href = "http://127.0.0.1:8000/admin/logout/"
}

function home() {
    window.location.href = "http://127.0.0.1:8000/"
}

function addMovie() {
    let divModal = document.querySelector('.content-add-movie');
    divModal.style.display = 'block';
}

function createMovie(is_anonymous = true) {
    let divModal = document.querySelector('.content-add-movie');
    divModal.style.display = 'none';

    let name = document.querySelector('#movieName')
    let textName = name.value
    let date = document.querySelector('#movieDate')
    let textDate = date.value
    let description = document.querySelector('#movieDescription')
    let textdescription = description.value

    name.value = "";
    date.value = "";
    description.value = "";

    let data = {
        name: textName,
        date: textDate,
        description: textdescription 
    }
    
    if (data.name != "" && data.date != "" && data.description != "") {
        if (is_anonymous) {
            console.log("Você precisa estar logado para realizar esta ação.");
        } else {
            const csrftoken = getCookie('csrftoken');
            const request = new Request(
                "http://127.0.0.1:8000/api/movies",
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', 'X-CSRFToken': csrftoken},
                    mode: 'same-origin',
                    body: JSON.stringify(data)
                }
            )
            fetch(request).then(res => {
                console.log("Request complete! response:", res);
                closeForm('.content-add-movie')
                requestMovies(is_anonymous)
            })
        }
    } else {
        closeForm('.content-add-movie')
        requestMovies(is_anonymous)
    }
    
}

function closeForm(form) {
    if (form != undefined) {
        let divModal = document.querySelector(form);
        divModal.style.display = 'none';
    }
}

function requestMovies(is_anonymous = true) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', 'http://127.0.0.1:8000/api/movies')
    xhr.send()

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            createMovieList(JSON.parse(xhr.responseText), is_anonymous);
        }
    }

}

function createMovieList(movies, is_anonymous) {
    let table = document.querySelector('#movies');
    let text = "";

    movies.forEach((movie) => {

        text += `<tr class="content-table-child">
            <td class="content-name">${movie.name}</td>
            <td class="content-date">${movie.date}</td>
            <td class="content-description">${movie.description}</td>
            <td class="content-table-buttons">
                <button class="button-more-info" onclick="moreInfo(${movie.id})">Ver Mais</button>
                <button class="${is_anonymous ? 'button-edit-movie-disable' : 'button-edit-movie' }" onclick="editMovie(${movie.id}, ${is_anonymous})">Editar</button>
                <button class="${is_anonymous ? 'button-delete-movie-disable' : 'button-delete-movie' }" onclick="requestDeleteMovie(${movie.id}, ${is_anonymous})">Excluir</button>
            </td>
        </tr>`;
    })

    table.innerHTML = text;
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function getMovie(id) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', `http://127.0.0.1:8000/api/movies/${id}`)
    xhr.send()

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            return JSON.parse(xhr.responseText);
        }
    }
}

function updateMovie(id, is_anonymous=true) {
    let name = document.querySelector('#editMovieName')
    let textName = name.value
    let date = document.querySelector('#editMovieDate')
    let textDate = date.value
    let description = document.querySelector('#editMovieDescription')
    let textdescription = description.value

    name.value = "";
    date.value = "";
    description.value = "";

    var data = {
        name: textName,
        date: textDate,
        description: textdescription
    };

    if (is_anonymous) {
        console.log("Você precisa estar logado para realizar esta ação.")
    } else {
        const csrftoken = getCookie('csrftoken');
        const request = new Request(
            `http://127.0.0.1:8000/api/movies/${id}`,
            {
                method: 'PUT',
                headers: {'Content-Type': 'application/json', 'X-CSRFToken': csrftoken},
                mode: 'same-origin',
                body: JSON.stringify(data)
            }
        )
        fetch(request).then(res => {
            console.log("Request complete! response:", res);
            requestMovies(is_anonymous);
        })
    }
    let divModal = document.querySelector('.content-edit-movie');
    divModal.style.display = 'none';
}

function editMovie(id, is_anonymous=true) {

    if (is_anonymous) {
        console.log("Você precisa estar logado para realizar esta ação.")
    } else {
        var xhr = new XMLHttpRequest()
        xhr.open('GET', `http://127.0.0.1:8000/api/movies/${id}`)
        xhr.send()
    
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                let data = JSON.parse(xhr.responseText);
                let modal = document.querySelector('#content-edit-movie');
                let text = "";
                console.log(data)
                text += `
                    <div class="left-bar"></div>
                    <form action="POST" class="content-data">
                        <h3>Informações</h3>
                        <input type="text" id="editMovieName" placeholder="Nome do filme..." value="${data.name}" required>
                        <input type="date" id="editMovieDate" placeholder="Data de lançamento..." value="${data.date}" required>
                        <textarea type="text" id="editMovieDescription" cols="30" rows="5" maxlength="200" placeholder="Descrição..." required>${data.description}</textarea>
                        <div class="content-request-buttons">
                            <input type="button" name="editMovie" id="editMovie" value="Salvar" onclick="updateMovie(${id}, ${is_anonymous})">
                            <button type="button" class="close-modal" onclick="closeForm('.content-edit-movie')">Cancelar</button>
                        </div>
                    </form>
                `;
            
                modal.innerHTML = text;
                let divModal = document.querySelector('.content-edit-movie');
                divModal.style.display = 'block';
            }
        }
    }
}

function requestDeleteMovie(id, is_anonymous = true) {
    if (is_anonymous) {
        console.log("Você precisa estar logado para realizar esta ação.");
    } else {
        var xhr = new XMLHttpRequest()
        xhr.open('GET', `http://127.0.0.1:8000/api/movies/${id}`)
        xhr.send()

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                let data = JSON.parse(xhr.responseText);
                let modal = document.querySelector('#content-delete-movie');
                let text = "";
                console.log(data)
                text += `
                    <div class="orange-bar"></div>
                    <div class="content-request-delete">
                        <div class="left-bar">
                            <img src="./static/images/warning.png">
                        </div>
                        <div class="right-bar">
                            <div class="top-bar">
                                <h3>Warning</h3>
                            </div>
                            <div class="bottom-bar">
                                <p>Você tem certeza que deseja remover</p>
                                o filme ${data.name}?
                            </div>
                            <div class="content-request-buttons">
                                <button class="content-button-confirm" onclick="deleteMovie(${data.id}, ${is_anonymous})">Confirmar</button>
                                <button class="content-button-delete" onclick="closeForm('.content-delete-movie')">Cancelar</button>
                            </div>
                        </div>
                    </div>
                `;
            
                modal.innerHTML = text;
                let divModal = document.querySelector('.content-delete-movie');
                divModal.style.display = 'block';
            }
        }
    }
}



function deleteMovie(id, is_anonymous = true) {
    if (is_anonymous) {
        console.log("Você precisa estar logado para realizar esta ação.");
    } else {
        const csrftoken = getCookie('csrftoken');
        const request = new Request(
            `http://127.0.0.1:8000/api/movies/${id}`,
            {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json', 'X-CSRFToken': csrftoken},
                mode: 'same-origin',
            }
        )
        fetch(request).then(res => {
            console.log("Request complete! response:", res);
            requestMovies(is_anonymous)
            let divModal = document.querySelector('.content-delete-movie');
            divModal.style.display = 'none';
        })
    }
}

function moreInfo(id) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', `http://127.0.0.1:8000/api/movies/${id}`)
    xhr.send()
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            let data = JSON.parse(xhr.responseText);
            let modal = document.querySelector('#content-edit-movie');
             let text = "";
             console.log(data)
             text += `
                 <div class="left-bar"></div>
                 <form action="POST" class="content-data">
                    <h3>Informações</h3>
                    <input type="text" id="editMovieName" placeholder="Nome do filme..." value="${data.name}" readonly>
                    <input type="date" id="editMovieDate" placeholder="Data de lançamento..." value="${data.date}" readonly>
                    <textarea type="text" id="editMovieDescription" cols="30" rows="5" maxlength="200" placeholder="Descrição..." readonly>${data.description}</textarea>
                    <div class="content-request-buttons">
                        <button type="button" class="close-modal" onclick="closeForm('.content-edit-movie')">Cancelar</button>
                    </div>
                </form>
            `;
            
            modal.innerHTML = text;
            let divModal = document.querySelector('.content-edit-movie');
            divModal.style.display = 'block';
        }
    }
}