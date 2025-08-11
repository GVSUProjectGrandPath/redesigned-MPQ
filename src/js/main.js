let currentQuestionIndex = 0; // Tracks the current question index
let selectedAnswers = []; // array for selected answers
let totalPoints = {
	"saver": 0,
	"spender": 0,
	"investor": 0,
	"compulsive": 0,
	"gambler": 0,
	"debtor": 0,
	"shopper": 0,
	"indifferent": 0
}; // Stores total points for each personality type

document.addEventListener('DOMContentLoaded', () => {
	const welcomeScreen = document.getElementById('welcome-screen2');
	// const descContainer = document.getElementById('desc-container');
	const quizContainer = document.getElementById('quiz-container');
	const startButton = document.getElementById('start-button2');
	const progressContainer = document.getElementById('progress-container');
	const progressBar = document.getElementById('progress-bar');
	const bodyElement = document.body;

	const totalQuestions = questions.length;

	// forces Safari to recognize :active for start button on mobile devices
	document.addEventListener("touchstart", function() {}, true);

	// Starts the quiz when the start button is clicked
	startButton.addEventListener('click', () => {
		welcomeScreen.style.display = 'none';
		// mainContainer.style.display = 'flex';
		quizContainer.style.display = 'flex';
		loadQuestion(currentQuestionIndex); // Load the first question
	});
	   //backbutton
	   const backButton = document.getElementById('back-button');
	   backButton.addEventListener('click', () => {

	   if (MobileDevice()) {
			backButton.classList.remove("mobile-click")
			void backButton.offsetWidth
			backButton.classList.add("mobile-click")
		}
		
	   if (currentQuestionIndex > 0) {
		   currentQuestionIndex--;
		   loadQuestion(currentQuestionIndex);
		} else {
		   // Return to welcome screen if on first question
		   quizContainer.style.display = 'none';
		   welcomeScreen.style.display = 'flex';
		   document.querySelectorAll('.answer-button').forEach(btn => btn.classList.remove('active'));
			backButton.classList.remove("mobile-click")
	   }
	   });
	   //backbutton

	document.getElementById('restart-button').addEventListener('click', restartQuiz);

	function MobileDevice() {
		return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
	}

	if (MobileDevice()) {
		// bodyElement.style.backgroundColor = '#b4efff';
		bodyElement.style.backgroundColor = 'black';
		document.querySelectorAll('#feedback-form label').forEach(label => {
			label.style.fontWeight = '550' 
		});
	}
   
	// for audio
	const sound = document.getElementById('hoverSound');
	const startButtonElement = document.getElementById('start-button2');

	startButtonElement.addEventListener('mouseenter', () => {
		sound.currentTime = 0;
		sound.play();
	  });

	// Sets up event listeners for answer buttons
	document.querySelectorAll('.answer-button').forEach(button => {
		button.addEventListener('click', function () {
			recordAnswer(this.value);

			if (MobileDevice()) {
				button.classList.remove("mobile-click")
				void button.offsetWidth
				button.classList.add("mobile-click")
			}
		});
	});

	// Updates the progress bar based on current question index
	function updateProgressBar() {
		if (totalQuestions > 0) {
			const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
			progressBar.style.width = `${progress}%`;
		}
	}

	// Loads the question at the specified index
	function loadQuestion(index) {
		const question = questions[index];
		document.getElementById('question-text').innerText = question.value;
		document.getElementById('step-indicator').innerText = `${index + 1} of  ${totalQuestions}`;


		updateProgressBar();

		document.getElementById('answer-sa').value = "sa";
		document.getElementById('answer-a').value = "a";
		document.getElementById('answer-n').value = "n";
		document.getElementById('answer-d').value = "d";
		document.getElementById('answer-sd').value = "sd";
		// Clear any previously active buttons and previous mobile clicks
		document.querySelectorAll('.answer-button').forEach(btn => btn.classList.remove('active'));
		document.querySelectorAll('.answer-button').forEach(btn => btn.classList.remove('mobile-click'));

		// Highlight the previously selected answer if it exists
		const selected = selectedAnswers[index];
		if (selected) {
			const button = document.querySelector(`.answer-button[value="${selected}"]`);
			button.classList.add('active');
		}
	}

	// Records the answer and updates the total points
	function recordAnswer(answer) {
		const question = questions[currentQuestionIndex];
	
		// If a previous answer exists for this question, subtract its points first
		const previousAnswer = selectedAnswers[currentQuestionIndex];
		if (previousAnswer) {
			const prevPoints = question.points[previousAnswer];
			for (const key in prevPoints) {
				if (totalPoints.hasOwnProperty(key)) {
					totalPoints[key] -= prevPoints[key]; // Subtract old points
				}
			}
		}
	
		// Save the new selected answer
		selectedAnswers[currentQuestionIndex] = answer;
	
		// Add new points
		const newPoints = question.points[answer];
		for (const key in newPoints) {
			if (totalPoints.hasOwnProperty(key)) {
				totalPoints[key] += newPoints[key];
			}
		}
	
		currentQuestionIndex++;
		if (currentQuestionIndex < questions.length) {
			loadQuestion(currentQuestionIndex);
		} else {
			showResults();
		}
	}

	// Displays the quiz results and personality type
	function showResults() {
		let maxPoints = 0;
		let personalityType = '';

		// Determine the personality type with the highest points
		for (const type in totalPoints) {
			if (totalPoints[type] > maxPoints) {
				maxPoints = totalPoints[type];
				personalityType = type;
			}
		}

		const personalityData = personalitiesData.descriptions[personalityType];

		//display none when result page is shown.
		progressContainer.style.display = 'none';
		document.getElementById('step-indicator').style.display = 'none';
		document.getElementById('question-container').style.display = 'none';
		document.getElementById('back-button').style.display = 'none';
		document.getElementById('answers').style.display = 'none';
		document.getElementById('result-container').style.display = 'block';
		document.getElementById('quiz-header').style.display = 'none';

		document.getElementById('result-header').innerText = `You are most similar to the ${capitalize(personalityData.animal)}`;

		const total = getTotalPoints();
		const resultsContainer = document.getElementById('detailed-results');

		resultsContainer.innerHTML = '';

		// Sort personality types by percentage
		const sortedTypes = Object.keys(totalPoints).map(type => {
			const percentage = (totalPoints[type] / total) * 100;
			return { type, percentage };
		}).sort((a, b) => b.percentage - a.percentage);

		console.log(sortedTypes)



		// Create buttons for each personality type
		let scaleFactor = 0;
		let count = 0;
		sortedTypes.forEach(({ type, percentage }) => {
			const animalName = personalitiesData.descriptions[type].animal;
			const activeSymbol = '<i class="fa-solid fa-eye"></i>';
			const inactiveSymbol = '';
			const click = ''

			const button = document.createElement('button');
			button.innerHTML = `${capitalize(animalName)}: ${percentage.toFixed(2)}% ${inactiveSymbol}`;

			button.onclick = () => {
				showPersonalityDetails(type);
				for (const btn of resultsContainer.children){
					btn.classList.remove('active');
					btn.style.animation = 'none';
					btn.innerHTML = btn.innerHTML.replace(activeSymbol, inactiveSymbol);
					btn.innerHTML = btn.innerHTML.replace(click, inactiveSymbol);
				}
				button.classList.add('active');
				button.innerHTML = `${capitalize(animalName)}: ${percentage.toFixed(2)}% ${activeSymbol}`;
			};

			if (count === 1) {
				button.innerHTML = `${capitalize(animalName)}: ${percentage.toFixed(2)}% ${click}`;
				count = 2;
			}

			if (count === 0 && type === personalityType) {
				button.classList.add('active');
				button.innerHTML = `${capitalize(animalName)}: ${percentage.toFixed(2)}% ${activeSymbol}`;

				count = 1;
				scaleFactor = 100/percentage;
				console.log(scaleFactor);
				button.style.width = '155%';
			}
			else {
				const buttonWidth = Math.max(95 + (percentage * scaleFactor * 0.6));
				console.log(buttonWidth);
				button.style.width = `${buttonWidth}%`;
			}

			resultsContainer.appendChild(button)
		});

		

		showPersonalityDetails(personalityType);

		// Save quiz result to the Node.js backend
		const currentDate = new Date().toISOString();
		const quizResult = {
			ResultId: Date.now().toString(),
			date: currentDate,
			personalityType: personalityType,
			saver: totalPoints.saver,
			spender: totalPoints.spender,
			investor: totalPoints.investor,
			compulsive: totalPoints.compulsive,
			gambler: totalPoints.gambler,
			debtor: totalPoints.debtor,
			shopper: totalPoints.shopper,
			indifferent: totalPoints.indifferent
		};

		saveQuizResult(quizResult);  // Call the new function to save the result
		// saveResultToFirestore(quizResult);


		function saveQuizResult(quizResult) {
			fetch("/api/save-result", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(quizResult)
			})
				.then(res => res.json())
				.then(data => console.log("✅ Result saved to backend:", data))
				.catch(err => console.error("❌ Error saving to backend:", err));
		}

		// function saveResultToFirestore(quizResult) {
		//     const collectionName = "finlit_results"; // New Firestore collection
		//     const docRef = db.collection(collectionName).doc(quizResult.personalityType);

		//     docRef.get().then((doc) => {
		//         if (doc.exists) {
		//             return docRef.update({
		//                 resultCount: firebase.firestore.FieldValue.increment(1)
		//             });
		//         } else {
		//             return docRef.set({
		//                 personalityType: quizResult.personalityType,
		//                 resultCount: 1
		//             });
		//         }
		//     }).then(() => {
		//         console.log(`✅ Firestore saved to ${collectionName}: ${quizResult.personalityType}`);
		//     }).catch((error) => {
		//         console.error("❌ Firestore error:", error);
		//     });
		// }


		async function saveQuizResult(quizResult) {
			try {
				const response = await fetch('https://mpq-backend.onrender.com/save-quiz-result', { //need to get the link from new backend on render
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(quizResult),
				});

				if (!response.ok) {
					throw new Error('Network response was not ok');
				}

				const data = await response.json();
				console.log(data.message);  // Log the success message
			} catch (error) {
				console.error('Error saving quiz result:', error);
			}
		}

		const userCommentArea = document.getElementById('userInput');
		const inappropriateWords = obscenity['badWords'];
		const inappropriateEmojis = obscenity['badEmojis'];

		// This checks for the custom profanity (words & emojis) created in profanity.js
		function containsCustomProfanity(text) {
			const words = text.toLowerCase().split(/\s+/);
			const chars = Array.from(text);
			const foundWord = words.some(word => inappropriateWords[word] || inappropriateEmojis[word]);
			const foundEmoji = chars.some(char => inappropriateEmojis[char]);
			return foundEmoji || foundWord
		}

		document.getElementById('feedback-form').addEventListener('submit', async (event) => {
			event.preventDefault(); // Prevent default form submission

			const unCleanComment = userCommentArea.value.trim();
			const cleanedComment = profanityCleaner.clean(unCleanComment);

			if (unCleanComment === "") {
				console.log("User ain't comment nothin!");
			}

			const foundCustomProfanity = containsCustomProfanity(unCleanComment);
			const foundLibraryProfanity = cleanedComment !== unCleanComment;

			if (foundLibraryProfanity || foundCustomProfanity) {
				console.warn('Profanity detected!!');
				catchedBadInput = false
			} else {
				console.log(cleanedComment);
			}

			const feedbackData = {
				shareHabits: event.target.shareHabits.value,
				recommendSurvey: event.target.recommendSurvey.value,
				resultsAccurate: event.target.resultsAccurate.value,
				resultsHelpful: event.target.resultsHelpful.value,
				practicalSteps: event.target.practicalSteps.value,
				timestamp: currentDate  // Add the current timestamp to the feedback data
			};

			try {
				const response = await fetch('https://mpq-backend.onrender.com/submit-feedback', { //need to get the link from new backend on render
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(feedbackData),
				});

				const result = await response.json();
				if (response.ok) {
					alert(result.message);
				} else {
					const unfilledLabels = []
					let keyNumber = 1
					for (const key in feedbackData) {
						if (feedbackData[key].length == 0) {
							unfilledLabels.push(`${keyNumber} | `)
						}
						keyNumber += 1
					}
					const unfilledLabels_str = unfilledLabels.join('')
					alert(`${result.error} Here are the unanswered questions: ${unfilledLabels_str}`);

				}
			} catch (error) {
				console.error('Error submitting feedback:', error);
				alert('Failed to submit feedback. Please try again later.');
			}
		});

		// pushpa starts
function showPersonalityDetails(personalityType) {
  const data = personalitiesData.descriptions[personalityType];
  if (!data) return;

  document.getElementById("descriptionText").textContent = data.description;
  injectList("advantagesList", data.advantages);
  injectList("disadvantagesList", data.disadvantages);
  injectList("motivatorsList", data.motivators);
  injectList("demotivatorsList", data.demotivators);

  const blueAdvantage = document.querySelector('.advantages.card.blue');
  const animalIconSymbol = document.querySelector('.animal_assets');

  // Create a resize observer
  const observer = new ResizeObserver(entries => {
  for (let entry of entries) {
	// const height = entry.contentRect.height;
	const height = entry.target.getBoundingClientRect().height;
	console.log(`New height: ${height}px`);
	// const animalIconSymbol = document.querySelector('.animal_assets');
	animalIconSymbol.style.top = (height + 5) + 'px';
	}
  });

  observer.observe(blueAdvantage);
//   console.log(blueAdvantage.getBoundingClientRect().height)

  const resultImage = document.getElementById("polaroid-animal-image");
  const imageMap = {
    "saver": "/src/assets/animal_pngs/polaroid/past_squirrel.png",
    "spender": "/src/assets/animal_pngs/polaroid/past_poodle.png",
    "investor": "/src/assets/animal_pngs/polaroid/past_owl.png",
    "compulsive": "/src/assets/animal_pngs/polaroid/past_bee.png",
    "gambler": "/src/assets/animal_pngs/polaroid/past_rabbit.png",
    "debtor": "/src/assets/animal_pngs/polaroid/past_armadillo.png",
    "shopper": "/src/assets/animal_pngs/polaroid/past_octopus.png",
    "indifferent": "/src/assets/animal_pngs/polaroid/past_panda.png"
  };

  resultImage.src = imageMap[personalityType] || "assets/futuresqu.png";
  resultImage.alt = data.animal;
  // Update large image in desc-container dynamically
const futureAnimalImg = document.querySelector(".desc-container .topsection .image img");
if (futureAnimalImg) {
  const capitalizedAnimal = data.animal.charAt(0).toUpperCase() + data.animal.slice(1); // e.g., "Squirrel"
  futureAnimalImg.src = `/src/assets/animal_pngs/futureAnimal_Profiles/Future_${capitalizedAnimal}.png`;
  futureAnimalImg.alt = `Future ${capitalizedAnimal}`;
}
// for the animal icons

const personalityIconImg = document.getElementById("personality-icon");

const iconMap = {
  "saver": "acorn.png",
  "spender": "diamond.png",
  "investor": "feather.png",
  "compulsive": "beehive.png",
  "gambler": "carrot.png",
  "debtor": "Piggy Bank.png",
  "shopper": "Seasell.png",
  "indifferent": "panda paw.png"
};

if (personalityIconImg && iconMap[personalityType]) {
  personalityIconImg.src = `/src/assets/animal_pngs/animal_assets/${iconMap[personalityType]}`;
  personalityIconImg.alt = data.animal;
}

}

function injectList(id, items) {
  const ul = document.getElementById(id);
  ul.innerHTML = "";
  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    ul.appendChild(li);
  });
}

		// pushpa ends

		// Just a function to capitalize certain text
		function capitalize(str) {
			return str.charAt(0).toUpperCase() + str.slice(1);
		}
	}

	// Gets collective points
	function getTotalPoints() {
		return Object.values(totalPoints).reduce((sum, points) => sum + points, 0);
	}

	document.getElementById('feedback-button').addEventListener('click', function () {

		let feedbackPopup = document.getElementById('feedback-popup');
		const overlay = document.querySelector('.overlay');

		feedbackPopup.classList.add('active');
		overlay.classList.add('visible')
		document.documentElement.style.overflow = 'hidden'; // html
		document.body.style.overflow = 'hidden'; // body
	});

	document.addEventListener('click', function (event) {
		let feedbackPopup = document.getElementById('feedback-popup');
		const overlay = document.querySelector('.overlay');

		if (!feedbackPopup.contains(event.target) && event.target.id !== 'feedback-button') {
			feedbackPopup.classList.remove('active');
			overlay.classList.remove('visible')
			document.documentElement.style.overflow = 'auto'; // html
			document.body.style.overflow = 'auto'; // body
		}
	});

	document.getElementById('closeXbutton').addEventListener('click', function () {
		let feedbackPopup = document.getElementById('feedback-popup');
		const overlay = document.querySelector('.overlay');

		feedbackPopup.classList.remove('active');
		overlay.classList.remove('visible')
		document.documentElement.style.overflow = 'auto'; // html
		document.body.style.overflow = 'auto'; // body
	});

	document.getElementById('userCommentBtn').addEventListener('click', function () {
		document.getElementById('userInput').style.display = 'block';
		document.getElementById('userCommentBtn').style.display = 'none'
	});

	document.querySelectorAll('select').forEach(select => {
		select.addEventListener('change', () => {
			const selectedValue = select.value;

			if (selectedValue !== "") {
				select.style.backgroundColor = '#FEDB04';
			}
		});
	  });

	// Restarts the quiz
	function restartQuiz() {
		currentQuestionIndex = 0;
		totalPoints = {
			"saver": 0,
			"spender": 0,
			"investor": 0,
			"compulsive": 0,
			"gambler": 0,
			"debtor": 0,
			"shopper": 0,
			"indifferent": 0
		};
		progressBar.style.width = '0%';
		progressContainer.style.display = 'block';
		document.getElementById('answers').style.display = 'block';
		document.getElementById('question-container').style.display = 'block';
		document.getElementById('result-container').style.display = 'none';
		loadQuestion(currentQuestionIndex);
		location.reload(); // Placeholder - need to just reset quiz like how I am trying above, but it screws up formatting, FIX
	}

	// Keyboard shortcut to instantly finish quiz
	let pressedKeys = {};

	document.addEventListener('keydown', (event) => {
		pressedKeys[event.key] = true;
		// Check for specific key combinations
		if (pressedKeys['s'] && pressedKeys['k']) {
			if (welcomeScreen.style.display !== 'none') {
				welcomeScreen.style.display = 'none';
				quizContainer.style.display = 'flex';
			}
			totalPoints = {
				"saver": 10,
				"spender": 7,
				"investor": 5,
				"compulsive": 4,
				"gambler": 3,
				"debtor": 2,
				"shopper": 1,
				"indifferent": 1
			};
			showResults();
			}
		});

		document.addEventListener('keyup', (event) => {
			delete pressedKeys[event.key];
		});
	});
