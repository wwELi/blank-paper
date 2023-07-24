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

function showImage() {



    // fetch('/api/file', { method: 'GET', responseType: 'blob',headers: { Range: 'bytes=0-' } }).then((res) => {
    //     res.blob().then((blob) => {
    //         console.log(blob)
    //         const url = URL.createObjectURL(blob)
    //         const image = new Image(500);
    //         image.src = url;
    //         document.body.appendChild(image);
            
    //     })
    // })

    getBigFile('/api/file').then((buffers) => {
        // console.log('--', buffers)
        const blob = new Blob([buffers])
        const url = URL.createObjectURL(blob)
        const image = new Image(500);
            image.src = url;
            document.body.appendChild(image);
    })
    async function getBigFile(url) {
        const unit = 1024 * 20;
        let baseByteLength = unit;
        const res = await fetch(url, { method: 'GET', headers: { Range: `bytes=0-${baseByteLength}` }});
        if (res.status === 200) {
            return res.blob();
        }

        if (res.status !== 206) {
            return;
        }
        const firstUtilArray = await res.arrayBuffer();
        const contentRange = res.headers.get('Content-Range');
        const size = Number(contentRange.match(/\/(\d+)$/)[1]);
        const promises = [];
        let flag = true;

        while(flag) {
            const start = baseByteLength + 1;
            baseByteLength = start + unit;
            promises.push(fetch(url, { method: 'GET', headers: { Range: `bytes=${start}-${baseByteLength}`}}).then(n => n.arrayBuffer()));
            if (baseByteLength > size) {
                flag = false;
            }
        }

        const buffer = new Uint8Array(size)

        buffer.set(new Uint8Array(firstUtilArray), 0);

        const arrs = await Promise.all(promises);

        arrs.reduce((prevLen, b8) => {
            buffer.set(new Uint8Array(b8), prevLen)
            return b8.byteLength + prevLen;
        }, firstUtilArray.byteLength);

        return buffer
        // return firstUtilArray;
    }
}
