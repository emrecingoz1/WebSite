import { firebaseConfig } from "./firebase.js";

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


// ========================================
// FIREBASE
// ========================================

const app =
    initializeApp(firebaseConfig);

const db =
    getFirestore(app);


// ========================================
// EKRANLAR
// ========================================

const questionScreen =
    document.getElementById("questionScreen");

const dateScreen =
    document.getElementById("dateScreen");

const planScreen =
    document.getElementById("planScreen");

const summaryScreen =
    document.getElementById("summaryScreen");


// ========================================
// BUTONLAR
// ========================================

const yesButton =
    document.getElementById("yesButton");

const noButton =
    document.getElementById("noButton");

const planButton =
    document.getElementById("planButton");

const savePlanButton =
    document.getElementById("savePlanButton");


// ========================================
// INPUTLAR
// ========================================

const timeInput =
    document.getElementById("timeInput");

const errorMessage =
    document.getElementById("errorMessage");

const noHint =
    document.getElementById("noHint");


// ========================================
// SEÇİMLER
// ========================================

let selectedDate = null;

let selectedActivity = null;


// ========================================
// HAYIR BUTONU
// ========================================

let noMoveCount = 0;

function moveNoButton() {

    noMoveCount++;

    const randomX =
        Math.random() * 260 - 130;

    const randomY =
        Math.random() * 120 - 60;

    noButton.style.transform =
        `translate(${randomX}px, ${randomY}px)`;


    if (noMoveCount === 1) {

        noHint.textContent =
            "Bir daha düşün.";

    } else if (noMoveCount === 3) {

        noHint.textContent =
            "Bu kadar kolay vazgeçme.";

    } else if (noMoveCount >= 5) {

        noHint.textContent =
            "Bu buton biraz kararsız galiba.";

    }
}


// Bilgisayarda üzerine gelince kaçar

noButton.addEventListener(
    "mouseenter",
    moveNoButton
);


// Telefonda dokununca kaçar

noButton.addEventListener(
    "touchstart",
    function (event) {

        event.preventDefault();

        moveNoButton();

    },
    {
        passive: false
    }
);


// Tıklamayı engelle

noButton.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        moveNoButton();

    }
);


// ========================================
// OLUR BUTONU
// ========================================

yesButton.addEventListener(
    "click",
    function () {

        questionScreen.classList.add(
            "hidden"
        );

        dateScreen.classList.remove(
            "hidden"
        );

    }
);


// ========================================
// PLANLAMA EKRANI
// ========================================

planButton.addEventListener(
    "click",
    function () {

        dateScreen.classList.add(
            "hidden"
        );

        planScreen.classList.remove(
            "hidden"
        );

    }
);


// ========================================
// TARİH SEÇİMİ
// ========================================

const dateButtons =
    document.querySelectorAll(
        ".date-option"
    );


dateButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                dateButtons.forEach(
                    function (item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                button.classList.add(
                    "selected"
                );


                selectedDate =
                    button.dataset.date;


                errorMessage.textContent =
                    "";

            }
        );

    }
);


// ========================================
// AKTİVİTE SEÇİMİ
// ========================================

const activityButtons =
    document.querySelectorAll(
        ".activity"
    );


activityButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                activityButtons.forEach(
                    function (item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                button.classList.add(
                    "selected"
                );


                selectedActivity =
                    button.dataset.activity;


                errorMessage.textContent =
                    "";

            }
        );

    }
);


// ========================================
// AKTİVİTE İKONU
// ========================================

function getActivityIcon(activity) {

    const icons = {

        "Kahve": "☕",

        "Film": "🎬",

        "Akşam Yemeği": "🍝",

        "Parkta Yürümek": "🌳",

        "Bir Şeyler İçmek": "🍷",

        "Beni Şaşırt": "🎁"

    };


    return icons[activity] || "•";
}


// ========================================
// PLANI KAYDET
// ========================================

savePlanButton.addEventListener(
    "click",
    async function () {

        const selectedTime =
            timeInput.value;


        if (!selectedDate) {

            errorMessage.textContent =
                "Önce hangi gün buluşacağımıza karar verelim.";

            return;
        }


        if (!selectedTime) {

            errorMessage.textContent =
                "Saat seçmeyi unutma.";

            return;
        }


        if (!selectedActivity) {

            errorMessage.textContent =
                "Bir de ne yapacağımıza karar verelim.";

            return;
        }


        errorMessage.textContent =
            "";


        savePlanButton.disabled =
            true;


        savePlanButton.textContent =
            "Plan kaydediliyor...";


        try {

            await addDoc(
                collection(
                    db,
                    "dates"
                ),
                {

                    date:
                        selectedDate,

                    time:
                        selectedTime,

                    activity:
                        selectedActivity,

                    createdAt:
                        serverTimestamp()

                }
            );


            showSummary(
                selectedDate,
                selectedTime,
                selectedActivity
            );


        } catch (error) {

            console.error(
                "Firebase kayıt hatası:",
                error
            );


            errorMessage.textContent =
                "Bir şeyler ters gitti. Tekrar deneyelim.";


            savePlanButton.disabled =
                false;


            savePlanButton.textContent =
                "Tamamdır, planlayalım";

        }

    }
);


// ========================================
// ÖZET
// ========================================

function showSummary(
    date,
    time,
    activity
) {

    planScreen.classList.add(
        "hidden"
    );

    summaryScreen.classList.remove(
        "hidden"
    );


    const dateObject =
        new Date(
            date + "T00:00:00"
        );


    const formattedDate =
        dateObject.toLocaleDateString(
            "tr-TR",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    document.getElementById(
        "summaryDate"
    ).textContent =
        formattedDate;


    document.getElementById(
        "summaryTime"
    ).textContent =
        time;


    document.getElementById(
        "summaryActivity"
    ).textContent =
        activity;


    document.getElementById(
        "summaryActivityIcon"
    ).textContent =
        getActivityIcon(
            activity
        );

}