document.addEventListener("DOMContentLoaded", function () {
  let startBtn = document.getElementById("start-btn");
  let picDiv = document.getElementById("pic-div");
  let startClicked = false;
  let startBtnCoords;
  let startBtnCenter = {};
  let imageOneBottomRight;
  let imageTwoBottomLeft;
  let faceOneEl;
  let faceTwoEl;
  let mouseCoords = [];
  let startClickedCoords;
  let imageClickedCoords;
  let trials = [];
  let vWidth;
  let vHeight;
  let facePairs = [];
  let facePairsOriginal = [];
  let count = 0;
  let temp = [0, 0];
  let pair = [0, 0];
  let counter = 0;
  let pairIndex;
  let startTime;
  let endTime;
  let faces = [
    "./assets/images/KHStudy2.jpg",
    "./assets/images/rsz_1bf225_2.jpg",
    "./assets/images/rsz_1bf254_2.jpg",
    "./assets/images/rsz_1bfage393_2.jpg",
    "./assets/images/rsz_1if3.jpg",
    "./assets/images/rsz_1if5.jpg",
    "./assets/images/rsz_2bf238_2.jpg",
    "./assets/images/rsz_2bfage39_3.jpg",
    "./assets/images/rsz_2if4.jpg",
    "./assets/images/rsz_3if1.jpg",
    "./assets/images/rsz_3if2.jpg",
  ];

  class Trial {
    constructor(
      leftImage,
      rightImage,
      clickedImage,
      startButtonCenter,
      startButtonClickedCoords,
      bottomRightCoords,
      bottomLeftCoords,
      imageClickedCoords,
      mouseCoords,
      timeInMilliseconds
    ) {
      this.leftImage = leftImage;
      this.rightImage = rightImage;
      this.clickedImage = clickedImage;
      this.startButtonCenter = startButtonCenter;
      this.startButtonClickedCoords = startButtonClickedCoords;
      this.bottomRightOfLeftPic = bottomRightCoords;
      this.bottomLeftOfRightPic = bottomLeftCoords;
      this.imageClickedCoords = imageClickedCoords;
      this.mouseCoords = mouseCoords;
      this.timeInMilliseconds = timeInMilliseconds;
    }
  }

  let firebaseConfig = {
    apiKey: "AIzaSyCkycalctLa0EAqTaG8M5rtuNVpCuy19gA",
    authDomain: "mouse-moves.firebaseapp.com",
    databaseURL: "https://mouse-moves.firebaseio.com",
    projectId: "mouse-moves",
    storageBucket: "mouse-moves.appspot.com",
    messagingSenderId: "224502296732",
    appId: "1:224502296732:web:376f8eaf24bee379a93d59",
    measurementId: "G-MLEBLR98B5",
  };

  let database = firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  let today = new Date();
  let todayString = today.toDateString();
  let dbRef = database.database().ref(todayString);
  let userRef = dbRef.push();
  let id = userRef.key;

  onmousemove = function (e) {
    if (startClicked) {
      Coords = { x: e.clientX, y: e.clientY };
      mouseCoords.push(Coords);
    }
  };

  function start() {
    startBtnCoords = startBtn.getBoundingClientRect();
    let startX = (startBtnCoords.left + startBtnCoords.right) / 2;
    let startY = (startBtnCoords.top + startBtnCoords.bottom) / 2;
    startBtnCenter = { x: startX, y: startY };
    startBtn.addEventListener("click", function (e) {
      e.preventDefault;
      if (count === facePairsOriginal.length) {
        startBtn.disabled = true;
        updateDatabase();
      } else {
        let x = e.clientX;
        let y = e.clientY;
        startClickedCoords = { x, y };
        startClicked = true;
        startBtn.disabled = true;
        startTime = new Date();
        loadFaces();
      }
    });
  }

  function pairs(arr) {
    let l = arr.length;

    for (let i = 0; i < l; i++) {
      for (let j = i + 1; j < l; j++) {
        facePairs.push([arr[i], arr[j]]);
        facePairsOriginal.push([arr[i], arr[j]]);
      }
    }
  }

  function loadFaces() {
    faceOneDiv = document.getElementById("face-one");
    faceTwoDiv = document.getElementById("face-two");
    count++;

    if (count <= facePairsOriginal.length) {
      do {
        if(count === facePairsOriginal.length){
          break;
        }
        pairIndex = Math.floor(Math.random() * facePairs.length);
        pair = facePairs[pairIndex];
        counter++;
        if (facePairs.length <= 4) {
          break;
        }
      } while (
        pair[0] === temp[0] ||
        pair[0] === temp[1] ||
        pair[1] === temp[0] ||
        pair[1] === temp[1]
      );

      temp = pair;
      counter = 0;

      if (!faceOneDiv.firstElementChild || !faceTwoDiv.firstElementChild) {
        faceOneEl = document.createElement("img");
        faceTwoEl = document.createElement("img");

        faceOneEl.setAttribute("id", "face-1");
        faceTwoEl.setAttribute("id", "face-2");
        faceOneEl.setAttribute("src", pair[0]);
        faceTwoEl.setAttribute("src", pair[1]);
        faceOneEl.setAttribute("class", "img-fluid mx-auto d-block");
        faceTwoEl.setAttribute("class", "img-fluid mx-auto d-block");
        faceOneEl.addEventListener("click", function (e) {
          e.preventDefault;
          let rect1 = faceOneEl.getBoundingClientRect();
          let rect2 = faceTwoEl.getBoundingClientRect();
          imageOneBottomRight = { x: rect1.right, y: rect1.bottom };
          imageTwoBottomLeft = { x: rect2.left, y: rect2.bottom };
          imageClickedCoords = { x: e.clientX, y: e.clientY };
          saveData(
            pair[0].substring(16),
            pair[1].substring(16),
            imageOneBottomRight,
            imageTwoBottomLeft,
            0,
            imageClickedCoords
          );
        });
        faceTwoEl.addEventListener("click", function (e) {
          e.preventDefault;
          let rect1 = faceOneEl.getBoundingClientRect();
          let rect2 = faceTwoEl.getBoundingClientRect();
          imageOneBottomRight = { x: rect1.right, y: rect1.bottom };
          imageTwoBottomLeft = { x: rect2.left, y: rect2.bottom };
          imageClickedCoords = { x: e.clientX, y: e.clientY };
          saveData(
            pair[1].substring(16),
            pair[0].substring(16),
            imageTwoBottomLeft,
            imageOneBottomRight,
            1,
            imageClickedCoords
          );
        });

        faceOneDiv.appendChild(faceOneEl);
        faceTwoDiv.appendChild(faceTwoEl);
        picDiv.classList.remove("invisible");
      } else {
        faceOne = document.getElementById("face-1");
        faceTwo = document.getElementById("face-2");

        faceOneEl.setAttribute("src", pair[0]);
        faceTwoEl.setAttribute("src", pair[1]);
        picDiv.classList.remove("invisible");
      }

      facePairs.splice(pairIndex, 1);
    }
  }

  function saveData(
    clickedImage,
    otherImage,
    image1Coords,
    image2Coords,
    leftOrRight,
    imgClickedCoords
  ) {
    endTime = new Date();
    let timeInMilliseconds = endTime - startTime;
    picDiv.classList.add("invisible");
    startClicked = false;
    if (leftOrRight === 0) {
      let data = new Trial(
        clickedImage,
        otherImage,
        clickedImage,
        startBtnCenter,
        startClickedCoords,
        image1Coords,
        image2Coords,
        imgClickedCoords,
        mouseCoords,
        timeInMilliseconds
      );
      vWidth = window.innerWidth;
      vHeight = window.innerHeight;
      data.screenSize = { vWidth, vHeight };
      trials.push(data);
    } else {
      let data = new Trial(
        otherImage,
        clickedImage,
        clickedImage,
        startBtnCenter,
        startClickedCoords,
        image1Coords,
        image2Coords,
        imgClickedCoords,
        mouseCoords,
        timeInMilliseconds
      );
      vWidth = window.innerWidth;
      vHeight = window.innerHeight;
      data.screenSize = { vWidth, vHeight };
      trials.push(data);
    }
    console.log(trials);
    mouseCoords = [];
    if (count == facePairsOriginal.length) {
      startBtn.innerText ="Submit";
    }
    startBtn.disabled = false;
  }

  updateDatabase = function () {
    userRef.set(trials).catch(function (error) {
      console.log(error);
    });
  };

  pairs(faces);
  start();
});
