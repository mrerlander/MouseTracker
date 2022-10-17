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
  let mouseInterval;
  let instructions = "instructions.html";
  let disqualified = "qualify.html";
  let study = "mousetracking001"
  let breakCount;
  let breakDiv = document.getElementById("break");
  let breakVis = false;
  const urlParams = new URLSearchParams(location.search);
  let surveyURL;
  let asianArr = [
    "Smart",
    "Academic",
    "Productive",
    "Educated",
    "Petite",
    "Rice",
    "Family-oriented",
    "Asian",
  ];
  let blackArr = [
    "Strong",
    "Musical",
    "Cool",
    "Football",
    "Liberal",
    "Masculine",
    "Muscular",
    "Black",
  ];
  let latinaArr = [
    "Religious",
    "Pi&ntilde;ata",
    "Catholic",
    "fun",
    "Mariachi",
    "Proud",
    "Farmer",
    "Latina",
  ];
  let whiteArr = [
    "Suburban",
    "Fortunate",
    "Rich",
    "American",
    "Christian",
    "Smart",
    "Proper",
    "White",
  ];
  let womenArr = [
    "Feminine",
    "Caring",
    "Caregiver",
    "Pretty",
    "Baking",
    "Loving",
    "Soft",
    "Woman",
  ];
  let practiceArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let racePairs = [];
  let genderPairs = [];
  let challengePairs = [];
  let allPairsOriginal;
  let allPairs;

  if (checkBox) {
    if (urlParams.has('student')){
      localStorage.setItem('student', 'student');
      localStorage.setItem('surveyURL', 'https://csunsbs.qualtrics.com/jfe/form/SV_6SesU0wzutojsXQ?id=');
    } else {
      localStorage.setItem('student', 'public');
      localStorage.setItem('surveyURL', 'https://csunsbs.qualtrics.com/jfe/form/SV_6SesU0wzutojsXQ?id=')
    }
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
    if (localStorage.getItem("disqualified")) {
      window.location.href = disqualified;
    } else {
      form.onsubmit = submit;
      function submit(e) {
        e.preventDefault();
        age = form.firstElementChild.lastElementChild.value;
        race = form.children[1].lastElementChild.value;
        gender = form.children[2].lastElementChild.value;

        if (
          gender == "Non-binary" ||
          gender == "Male" ||
          race == "Multiracial" ||
          race == "Other"
        ) {
          localStorage.setItem("disqualified", true);
          window.location.href = disqualified;
        } else {
          localStorage.setItem("age", age);
          localStorage.setItem("race", race);
          localStorage.setItem("gender", gender);
          window.location.href = instructions;
        }
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
      window.mouseX = e.clientX;
      window.mouseY = e.clientY;
  };

  function mousePosition(){
    Coords = { x: window.mouseX, y: window.mouseY, time: Date.now() };
    mouseCoords.push(Coords);
  }


  let practice = true;
  let practiceCounter = 0;

  function start() {
    age = localStorage.getItem("age");
    race = localStorage.getItem("race");
    gender = localStorage.getItem("gender");

    switch (race.toLowerCase()) {
      case "asian":
        pairs(asianArr, "race");
        break;

      case "black":
        pairs(blackArr, "race");
        break;

      case "latino":
        pairs(latinaArr, "race");
        break;

      case "white":
        pairs(whiteArr, "race");
        break;

      default:
        console.log("error: no race");
        break;
    }
    concat();
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
        if (count === allPairsOriginal.length) {
          startBtn.disabled = true;
          updateDatabase();
        } else {
          if (practiceCounter === 10) {
            document.getElementById("practice-over").classList.add("invisible");
            leftTrialDiv.classList.remove("invisible");
            rightTrialDiv.classList.remove("invisible");
          }
          if(breakVis){
            breakDiv.classList.add("invisible");
            breakVis = false;
          }
          let x = e.clientX;
          let y = e.clientY;
          startClickedCoords = { x, y };
          startClicked = true;
          startBtn.disabled = true;
          startTime = new Date();
          mouseInterval = setInterval(mousePosition, (1000 / 60));
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
        clearInterval(mouseInterval);
        saveData(
          pair[0],
          pair[1],
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
        clearInterval(mouseInterval);
        saveData(
          pair[1],
          pair[0],
          buttonTwoBottomLeft,
          buttonOneBottomRight,
          1,
          buttonClickedCoords
        );
      }
    });
  }

  function concat() {
    let userRaceArr;
    switch (race.toLowerCase()) {
      case "asian":
        userRaceArr = asianArr;
        break;

      case "black":
        userRaceArr = blackArr;
        break;

      case "latino":
        userRaceArr = latinaArr;
        break;

      case "white":
        userRaceArr = whiteArr;
        break;

      default:
        console.log("error: no race");
        break;
    }
    for (let i = 0; i < userRaceArr.length; i++) {
      for (let j = 0; j < womenArr.length; j++) {
        challengePairs.push([userRaceArr[i], womenArr[j]]);
        challengePairs.push([womenArr[j], userRaceArr[i]]);
      }
    }

    allPairsOriginal = [].concat(challengePairs, racePairs, genderPairs);
    allPairs = [...allPairsOriginal];
    breakCount = (allPairsOriginal.length / 2);
  }

  function pairs(arr, arrType) {
    let l = arr.length;

    for (let i = 0; i < l; i++) {
      for (let j = i + 1; j < l; j++) {
        switch (arrType) {
          case "race":
            racePairs.push([arr[i], arr[j]]);
            racePairs.push([arr[j], arr[i]]);
            break;

          case "gender":
            genderPairs.push([arr[i], arr[j]]);
            genderPairs.push([arr[j], arr[i]]);
            break;

          case "practice":
            practicePairs.push([arr[i], arr[j]]);
            break;

          default:
            break;
        }
      }
    }
  }

  function loadTrial() {
    if (practice === true) {
      practiceCounter++;
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

      if (count <= allPairsOriginal.length) {
        do {
          if (count === allPairsOriginal.length) {
            break;
          }
          pairIndex = Math.floor(Math.random() * allPairs.length);
          pair = allPairs[pairIndex];
          counter++;
          if (allPairs.length <= 4) {
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

        optionOne.innerHTML = buttonOneText;
        optionTwo.innerHTML = buttonTwoText;

        trialDiv.classList.remove("invisible");
      } else {
        optionOne.innerHTML = buttonOneText;
        optionTwo.innerHTML = buttonTwoText;
        trialDiv.classList.remove("invisible");
      }

      allPairs.splice(pairIndex, 1);
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
      data.testPool = localStorage.getItem('student');
      trials.push(data);
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
      data.testPool = localStorage.getItem('student');
      trials.push(data);
    }

    mouseCoords = [];
    if (count == allPairsOriginal.length) {
      startBtn.innerHTML = "Submit";
    }

    if (count == breakCount) {
      breakDiv.classList.remove("invisible");
      breakVis = true;
    }

    startBtn.disabled = false;
  }

  updateDatabase = function () {
    surveyURL = localStorage.getItem('surveyURL');
    userRef
      .set(trials)
      .then(function () {
        localStorage.clear();
        window.location.href =
          surveyURL + id + "&study=" + study;
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  pairs(practiceArr, "practice");
  pairs(womenArr, "gender");
  if (startBtn) {
    start();
  }
});
