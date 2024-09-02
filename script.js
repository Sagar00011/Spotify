console.log('Hello and welcome to js coding...');

let currentSong = new Audio();
let curFolder;
let songs;


function formatSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    // Round down the seconds to the nearest whole number
    const totalSeconds = Math.floor(seconds);

    // Calculate minutes and seconds
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    // Format minutes and seconds with leading zeros if needed
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    // Return formatted string
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    curFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songul = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songul.innerHTML = ""
    for (const song of songs) {

        songul.innerHTML = songul.innerHTML + `<li>
                            <img class="invert" src="images/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div> </div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <img class="invert" src="images/play.svg" alt="">
                            </div>
                        </li>` ;

    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            //    console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })

    })
    return songs;
}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentSong.src = `/${curFolder}/` + track;
    if (!pause) {
        currentSong.play()
        play.src = "images/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".card-container")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0];
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/sam.json`);
            let response = await a.json();
            // console.log(response);

            cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="path">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="#000">
                        <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>
                            </div>
                        <img src="/songs/${folder}/img1.png" alt="image 1">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`

        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        // console.log(e);
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0])
        })

    })

}

async function main() {
    await getSongs("songs/Arijit");
    // console.log(songs);

    // displayAlbums function
    displayAlbums();

    playMusic(songs[0], true)

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "images/pause.svg"
        }

        else {
            currentSong.pause()
            play.src = "images/play.svg"
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime , currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${formatSeconds(currentSong.currentTime)} / ${formatSeconds(currentSong.duration)} `
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100

    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    //  To play previous song 

    previous.addEventListener("click", () => {
        // console.log(currentSong);
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }

    })

    // To play next song 

    next.addEventListener("click", () => {
        currentSong.pause()
        // console.log(currentSong);
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }

    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log('setting volume to ' , e.target.value , "/100");
        currentSong.volume = parseInt(e.target.value) / 100;
        if(currentSong.volume > 0){
            document.querySelector(".volume > img").src = document.querySelector(".volume > img").src.replace("images/mute.svg", "images/volume.svg")   
        }
        else if(currentSong.volume == 0){
            document.querySelector(".volume > img").src = document.querySelector(".volume > img").src.replace("images/volume.svg" , "images/mute.svg");
        }
    })

    document.querySelector(".volume > img").addEventListener("click", e => {
        if (e.target.src.includes("images/volume.svg")) {
            e.target.src = e.target.src.replace("images/volume.svg", "images/mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }

        else {
            e.target.src = e.target.src.replace("images/mute.svg", "images/volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })

}

main()