document.addEventListener("DOMContentLoaded", function () {
  let checkBox = document.getElementById("consent");
  let nextBtn = document.getElementById("submit-button");
  let startBtn = document.getElementById("start-btn");
  let inst1 = document.getElementById("instructions-one");
  let inst2 = document.getElementById("instructions-two");
  let inst3 = document.getElementById("instructions-three");
  let instructionsBtn = document.getElementById("instructions-button");
  let trialDiv = document.getElementById("trial-div");
  let startClicked = false;
  let startBtnCoords;
  let startBtnCenter = {};
  let buttonOneBottomRight;
  let buttonTwoBottomLeft;
  let mouseCoords = [];
  let startClickedCoords;
  let buttonClickedCoords;
  let trials = [];
  let rect1;
  let rect2;
  let vWidth;
  let vHeight;
  let practicePairs = [];
  let facePairs = [];
  let facePairsOriginal = [];
  let count = 0;
  let temp = [0, 0];
  let pair = [0, 0];
  let counter = 0;
  let pairIndex;
  let startTime;
  let endTime;
  let form = document.getElementById("form");
  let age;
  let race;
  let gender;
  let buttonOneText;
  let buttonTwoText;
  let instructions = "instructions.html";
  let disqualified = "qualify.html";
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
  let practiceArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  if (checkBox) {
    checkBox.onchange = function () {
      if (this.checked) {
        nextBtn.disabled = false;
      } else {
        nextBtn.disabled = true;
      }
    };
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function (e) {
      e.preventDefault;
      localStorage.setItem("consent", "true");
      window.location.href = "form.html";
    });
  }

  let instCounter = 0;
  if (instructionsBtn) {
    instructionsBtn.addEventListener("click", function (e) {
      e.preventDefault;

      if (instCounter === 2) {
        window.location.href = "study.html";
      }

      if (instCounter === 1) {
        inst2.style.display = "none";
        inst3.style.display = "block";
        instCounter++;
      }

      if (instCounter === 0) {
        inst1.style.display = "none";
        inst2.style.display = "block";
        instCounter++;
      }
    });
  }

  if (form) {
    form.onsubmit = submit;
    function submit(e) {
      e.preventDefault();
      age = form.firstElementChild.lastElementChild.value;
      race = form.children[1].lastElementChild.value;
      gender = form.children[2].lastElementChild.value;

      if (gender == "Non-binary" || race == "Multiracial" || race == "Other") {
        window.location.href = disqualified;
      } else {
        window.location.href = instructions;
      }
    }
  }

  class Trial {
    constructor(
      leftWord,
      rightWord,
      clickedWord,
      startButtonCenter,
      startButtonClickedCoords,
      bottomRightCoords,
      bottomLeftCoords,
      buttonClickedCoords,
      mouseCoords,
      timeInMilliseconds
    ) {
      this.leftWord = leftWord;
      this.rightWord = rightWord;
      this.clickedWord = clickedWord;
      this.startButtonCenter = startButtonCenter;
      this.startButtonClickedCoords = startButtonClickedCoords;
      this.bottomRightOfLeftButton = bottomRightCoords;
      this.bottomLeftOfRightButton = bottomLeftCoords;
      this.buttonClickedCoords = buttonClickedCoords;
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

  let practice = true;
  let practiceCounter = 0;

  function start() {
    startBtnCoords = startBtn.getBoundingClientRect();
    let startX = (startBtnCoords.left + startBtnCoords.right) / 2;
    let startY = (startBtnCoords.top + startBtnCoords.bottom) / 2;
    startBtnCenter = { x: startX, y: startY };
    leftTrialDiv = document.getElementById("trial-left");
    rightTrialDiv = document.getElementById("trial-right");
    optionOne = document.getElementById("option-one");
    optionTwo = document.getElementById("option-two");

    startBtn.addEventListener("click", function (e) {
      e.preventDefault;
      if (practice === true) {
        startBtn.disabled = true;
        loadTrial();
      } else {
        if (count === facePairsOriginal.length) {
          startBtn.disabled = true;
          updateDatabase();
        } else {
          if (practiceCounter === 10) {
            document.getElementById("practice-over").classList.add("invisible");
            leftTrialDiv.classList.remove("invisible");
            rightTrialDiv.classList.remove("invisible");
          }
          let x = e.clientX;
          let y = e.clientY;
          startClickedCoords = { x, y };
          startClicked = true;
          startBtn.disabled = true;
          startTime = new Date();
          loadTrial();
        }
      }
    });
    optionOne.addEventListener("click", function (e) {
      e.preventDefault;
      if (practice === true) {
        trialDiv.classList.add("invisible");
        startBtn.disabled = false;
        if (practiceCounter === 10) {
          leftTrialDiv.classList.add("invisible");
          rightTrialDiv.classList.add("invisible");
          trialDiv.classList.remove("invisible");
          document
            .getElementById("practice-over")
            .classList.remove("invisible");
          practice = false;
        }
      } else {
        rect1 = optionOne.getBoundingClientRect();
        rect2 = optionTwo.getBoundingClientRect();
        buttonOneBottomRight = { x: rect1.right, y: rect1.bottom };
        buttonTwoBottomLeft = { x: rect2.left, y: rect2.bottom };
        buttonClickedCoords = { x: e.clientX, y: e.clientY };
        saveData(
          pair[0].substring(16),
          pair[1].substring(16),
          buttonOneBottomRight,
          buttonTwoBottomLeft,
          0,
          buttonClickedCoords
        );
      }
    });
    optionTwo.addEventListener("click", function (e) {
      e.preventDefault;
      if (practice === true) {
        trialDiv.classList.add("invisible");
        startBtn.disabled = false;
        if (practiceCounter === 10) {
          leftTrialDiv.classList.add("invisible");
          rightTrialDiv.classList.add("invisible");
          trialDiv.classList.remove("invisible");
          document
            .getElementById("practice-over")
            .classList.remove("invisible");
          practice = false;
        }
      } else {
        rect1 = optionOne.getBoundingClientRect();
        rect2 = optionTwo.getBoundingClientRect();
        buttonOneBottomRight = { x: rect1.right, y: rect1.bottom };
        buttonTwoBottomLeft = { x: rect2.left, y: rect2.bottom };
        buttonClickedCoords = { x: e.clientX, y: e.clientY };
        saveData(
          pair[1].substring(16),
          pair[0].substring(16),
          buttonTwoBottomLeft,
          buttonOneBottomRight,
          1,
          buttonClickedCoords
        );
      }
    });
  }

  function pairs(arr) {
    let l = arr.length;
    if (arr[0] === 0) {
      for (let i = 0; i < l; i++) {
        for (let j = i + 1; j < l; j++) {
          practicePairs.push([arr[i], arr[j]]);
        }
      }
    } else {
      for (let i = 0; i < l; i++) {
        for (let j = i + 1; j < l; j++) {
          facePairs.push([arr[i], arr[j]]);
          facePairsOriginal.push([arr[i], arr[j]]);
        }
      }
    }
  }

  function loadTrial() {
    if (practice === true) {
      practiceCounter++;
      console.log(practiceCounter);
      pairIndex = Math.floor(Math.random() * practicePairs.length);
      pair = practicePairs[pairIndex];

      if (Math.random() >= 0.5) {
        buttonOneText = pair[0];
        buttonTwoText = pair[1];
      } else {
        buttonOneText = pair[1];
        buttonTwoText = pair[0];
      }

      optionOne.innerHTML = buttonOneText;
      optionTwo.innerHTML = buttonTwoText;

      trialDiv.classList.remove("invisible");
    } else {
      count++;
      console.log(count + " in the else of the load");

      if (count <= facePairsOriginal.length) {
        do {
          if (count === facePairsOriginal.length) {
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
        buttonOneText = pair[0];
        buttonTwoText = pair[1];
        console.log(buttonOneText);

        optionOne.innerHTML = buttonOneText;
        optionTwo.innerHTML = buttonTwoText;

        trialDiv.classList.remove("invisible");
      } else {
        optionOne.innerHTML = buttonOneText;
        optionTwo.innerHTML = buttonTwoText;
        trialDiv.classList.remove("invisible");
      }

      facePairs.splice(pairIndex, 1);
    }
  }

  function saveData(
    clickedWord,
    otherWord,
    word1Coords,
    word2Coords,
    leftOrRight,
    wordClickedCoords
  ) {
    endTime = new Date();
    let timeInMilliseconds = endTime - startTime;
    trialDiv.classList.add("invisible");
    startClicked = false;
    if (leftOrRight === 0) {
      let data = new Trial(
        clickedWord,
        otherWord,
        clickedWord,
        startBtnCenter,
        startClickedCoords,
        word1Coords,
        word2Coords,
        wordClickedCoords,
        mouseCoords,
        timeInMilliseconds
      );
      vWidth = window.innerWidth;
      vHeight = window.innerHeight;
      data.screenSize = { vWidth, vHeight };
      data.age = age;
      data.race = race;
      data.gender = gender;
      trials.push(data);
      console.log(trials);
    } else {
      let data = new Trial(
        otherWord,
        clickedWord,
        clickedWord,
        startBtnCenter,
        startClickedCoords,
        word1Coords,
        word2Coords,
        wordClickedCoords,
        mouseCoords,
        timeInMilliseconds
      );
      vWidth = window.innerWidth;
      vHeight = window.innerHeight;
      data.screenSize = { vWidth, vHeight };
      data.age = age;
      data.race = race;
      data.gender = gender;
      trials.push(data);
      console.log(trials);
    }

    mouseCoords = [];
    if (count == facePairsOriginal.length) {
      startBtn.innerHTML = "Submit";
    }
    startBtn.disabled = false;
  }

  updateDatabase = function () {
    userRef.set(trials).catch(function (error) {
      console.log(error);
    });
  };

  pairs(practiceArr);
  pairs(faces);
  start();
});
