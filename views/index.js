function getVideoMediaStream() {
    return window.navigator.mediaDevices.getUserMedia({ video: true, audio: false })
}

function getVideoEl() {
    return document.querySelector('#my_video');
}

var imageBlob = null;

function  photograph() {
    const canvasEl = document.createElement('canvas');
    const videoEl = getVideoEl();
    const ctx = canvasEl.getContext('2d');

    canvasEl.width = videoEl.videoWidth;
    canvasEl.height = videoEl.videoHeight;
    ctx.drawImage(videoEl, 0, 0);
    // const base64 = canvasEl.toDataURL("image/jpeg", 0.1);
    canvasEl.toBlob((blob) => imageBlob = blob);
    document.body.appendChild(canvasEl);
}

var closeVideo = () => {};

async function openVideo() {
    const videoEl = getVideoEl();
    const stream = await getVideoMediaStream();
    const tracks =  stream.getVideoTracks()

    closeVideo = () => tracks.forEach(track => track.stop());

    videoEl.srcObject = stream;
}

function upload() {
    const formData = new FormData();

    formData.append('file', imageBlob, Date.now() + '.png');

    fetch('/api/users/test/upload', { method: 'POST', body: formData, headers: { Authorization: window.sessionStorage.getItem('token') } })
}


chooseFile.addEventListener('change', (evt) => {
    imageBlob = evt.target.files[0];
    upload();
})
