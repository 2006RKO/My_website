/* =========================================================
   CHAPCY WORLDWIDE REGISTRATION JS
========================================================= */


/* =========================================================
   WORLDWIDE COUNTRIES
========================================================= */

const countries = [

    ["🇹🇿","Tanzania","+255"],
    ["🇰🇪","Kenya","+254"],
    ["🇺🇬","Uganda","+256"],
    ["🇷🇼","Rwanda","+250"],
    ["🇧🇮","Burundi","+257"],
    ["🇸🇸","South Sudan","+211"],
    ["🇿🇦","South Africa","+27"],
    ["🇿🇲","Zambia","+260"],
    ["🇿🇼","Zimbabwe","+263"],
    ["🇲🇼","Malawi","+265"],
    ["🇲🇿","Mozambique","+258"],
    ["🇲🇬","Madagascar","+261"],
    ["🇲🇺","Mauritius","+230"],
    ["🇸🇨","Seychelles","+248"],
    ["🇸🇴","Somalia","+252"],
    ["🇪🇹","Ethiopia","+251"],
    ["🇰🇲","Comoros","+269"],
    ["🇦🇴","Angola","+244"],
    ["🇨🇲","Cameroon","+237"],
    ["🇨🇩","DR Congo","+243"],
    ["🇨🇬","Congo","+242"],
    ["🇬🇦","Gabon","+241"],
    ["🇸🇳","Senegal","+221"],
    ["🇨🇮","Ivory Coast","+225"],
    ["🇧🇫","Burkina Faso","+226"],
    ["🇲🇱","Mali","+223"],
    ["🇳🇪","Niger","+227"],
    ["🇹🇩","Chad","+235"],
    ["🇬🇳","Guinea","+224"],
    ["🇸🇱","Sierra Leone","+232"],
    ["🇱🇷","Liberia","+231"],
    ["🇬🇲","Gambia","+220"],
    ["🇲🇷","Mauritania","+222"],
    ["🇨🇻","Cape Verde","+238"],

    ["🇳🇬","Nigeria","+234"],
    ["🇬🇭","Ghana","+233"],
    ["🇪🇬","Egypt","+20"],
    ["🇲🇦","Morocco","+212"],
    ["🇩🇿","Algeria","+213"],
    ["🇸🇩","Sudan","+249"],
    ["🇹🇳","Tunisia","+216"],
    ["🇱🇾","Libya","+218"],

    ["🇺🇸","United States","+1"],
    ["🇨🇦","Canada","+1"],
    ["🇲🇽","Mexico","+52"],
    ["🇧🇷","Brazil","+55"],
    ["🇦🇷","Argentina","+54"],
    ["🇨🇱","Chile","+56"],
    ["🇨🇴","Colombia","+57"],
    ["🇵🇪","Peru","+51"],
    ["🇻🇪","Venezuela","+58"],
    ["🇺🇾","Uruguay","+598"],
    ["🇵🇾","Paraguay","+595"],
    ["🇧🇴","Bolivia","+591"],
    ["🇪🇨","Ecuador","+593"],
    ["🇨🇷","Costa Rica","+506"],
    ["🇵🇦","Panama","+507"],
    ["🇬🇹","Guatemala","+502"],
    ["🇭🇳","Honduras","+504"],
    ["🇳🇮","Nicaragua","+505"],
    ["🇸🇻","El Salvador","+503"],
    ["🇨🇺","Cuba","+53"],
    ["🇯🇲","Jamaica","+1"],
    ["🇭🇹","Haiti","+509"],
    ["🇧🇸","Bahamas","+1"],
    ["🇧🇧","Barbados","+1"],
    ["🇹🇹","Trinidad and Tobago","+1"],

    ["🇬🇧","United Kingdom","+44"],
    ["🇮🇪","Ireland","+353"],
    ["🇫🇷","France","+33"],
    ["🇩🇪","Germany","+49"],
    ["🇮🇹","Italy","+39"],
    ["🇪🇸","Spain","+34"],
    ["🇵🇹","Portugal","+351"],
    ["🇳🇱","Netherlands","+31"],
    ["🇧🇪","Belgium","+32"],
    ["🇨🇭","Switzerland","+41"],
    ["🇦🇹","Austria","+43"],
    ["🇸🇪","Sweden","+46"],
    ["🇳🇴","Norway","+47"],
    ["🇩🇰","Denmark","+45"],
    ["🇫🇮","Finland","+358"],
    ["🇵🇱","Poland","+48"],
    ["🇺🇦","Ukraine","+380"],
    ["🇷🇺","Russia","+7"],
    ["🇮🇸","Iceland","+354"],
    ["🇱🇺","Luxembourg","+352"],
    ["🇲🇹","Malta","+356"],
    ["🇨🇾","Cyprus","+357"],
    ["🇬🇷","Greece","+30"],
    ["🇷🇴","Romania","+40"],
    ["🇧🇬","Bulgaria","+359"],
    ["🇭🇺","Hungary","+36"],
    ["🇨🇿","Czech Republic","+420"],
    ["🇸🇰","Slovakia","+421"],
    ["🇭🇷","Croatia","+385"],
    ["🇷🇸","Serbia","+381"],
    ["🇸🇮","Slovenia","+386"],
    ["🇦🇱","Albania","+355"],
    ["🇲🇰","North Macedonia","+389"],
    ["🇧🇾","Belarus","+375"],
    ["🇱🇹","Lithuania","+370"],
    ["🇱🇻","Latvia","+371"],
    ["🇪🇪","Estonia","+372"],

    ["🇮🇳","India","+91"],
    ["🇵🇰","Pakistan","+92"],
    ["🇧🇩","Bangladesh","+880"],
    ["🇱🇰","Sri Lanka","+94"],
    ["🇳🇵","Nepal","+977"],
    ["🇨🇳","China","+86"],
    ["🇯🇵","Japan","+81"],
    ["🇰🇷","South Korea","+82"],
    ["🇹🇭","Thailand","+66"],
    ["🇻🇳","Vietnam","+84"],
    ["🇵🇭","Philippines","+63"],
    ["🇲🇾","Malaysia","+60"],
    ["🇸🇬","Singapore","+65"],
    ["🇮🇩","Indonesia","+62"],
    ["🇵🇬","Papua New Guinea","+675"],

    ["🇦🇪","United Arab Emirates","+971"],
    ["🇸🇦","Saudi Arabia","+966"],
    ["🇶🇦","Qatar","+974"],
    ["🇰🇼","Kuwait","+965"],
    ["🇧🇭","Bahrain","+973"],
    ["🇴🇲","Oman","+968"],
    ["🇮🇱","Israel","+972"],
    ["🇯🇴","Jordan","+962"],
    ["🇱🇧","Lebanon","+961"],
    ["🇮🇶","Iraq","+964"],
    ["🇮🇷","Iran","+98"],
    ["🇹🇷","Turkey","+90"],

    ["🇰🇿","Kazakhstan","+7"],
    ["🇺🇿","Uzbekistan","+998"],
    ["🇹🇲","Turkmenistan","+993"],
    ["🇰🇬","Kyrgyzstan","+996"],
    ["🇹🇯","Tajikistan","+992"],
    ["🇦🇫","Afghanistan","+93"],

    ["🇦🇺","Australia","+61"],
    ["🇳🇿","New Zealand","+64"],
    ["🇫🇯","Fiji","+679"],
    ["🇸🇧","Solomon Islands","+677"],
    ["🇻🇺","Vanuatu","+678"],
    ["🇼🇸","Samoa","+685"],
    ["🇹🇴","Tonga","+676"]

];


/* =========================================================
   ELEMENTS
========================================================= */

const registerForm =
    document.getElementById("registerForm");

const phoneNumber =
    document.getElementById("phoneNumber");

const phoneBox =
    document.getElementById("phoneBox");

const errorMessage =
    document.getElementById("errorMessage");

const nextButton =
    document.getElementById("nextButton");

const countryButton =
    document.getElementById("countryButton");

const countryOverlay =
    document.getElementById("countryOverlay");

const countryModal =
    document.getElementById("countryModal");

const closeCountry =
    document.getElementById("closeCountry");

const countrySearch =
    document.getElementById("countrySearch");

const countryList =
    document.getElementById("countryList");

const selectedFlag =
    document.getElementById("selectedFlag");

const selectedCode =
    document.getElementById("selectedCode");

const particles =
    document.getElementById("particles");


/* =========================================================
   CURRENT COUNTRY
========================================================= */

let currentCountry = {

    flag:"🇹🇿",

    name:"Tanzania",

    code:"+255"

};


/* =========================================================
   CREATE PARTICLES
========================================================= */

function createParticles(){

    const amount =
        window.innerWidth < 600
        ? 35
        : 65;


    for(
        let i = 0;
        i < amount;
        i++
    ){

        const particle =
            document.createElement("span");

        particle.className =
            "particle";


        particle.style.left =
            Math.random() * 100 + "%";


        particle.style.animationDuration =
            (7 + Math.random() * 12) + "s";


        particle.style.animationDelay =
            (Math.random() * 10) + "s";


        particle.style.opacity =
            .3 + Math.random() * .7;


        const size =
            1 + Math.random() * 3;


        particle.style.width =
            size + "px";

        particle.style.height =
            size + "px";


        particles.appendChild(
            particle
        );

    }

}


createParticles();


/* =========================================================
   OPEN COUNTRY MODAL
========================================================= */

countryButton.addEventListener(
    "click",
    function(){

        countryOverlay.classList.add(
            "show"
        );

        countrySearch.value = "";

        renderCountries(
            countries
        );

        setTimeout(
            function(){

                countrySearch.focus();

            },
            200
        );

    }
);


/* =========================================================
   CLOSE COUNTRY MODAL
========================================================= */

function closeCountryModal(){

    countryOverlay.classList.remove(
        "show"
    );

}


closeCountry.addEventListener(
    "click",
    closeCountryModal
);


/* =========================================================
   CLICK OUTSIDE MODAL
========================================================= */

countryOverlay.addEventListener(
    "click",
    function(event){

        if(
            event.target ===
            countryOverlay
        ){

            closeCountryModal();

        }

    }
);


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    function(event){

        if(
            event.key === "Escape"
        ){

            closeCountryModal();

        }

    }
);


/* =========================================================
   RENDER COUNTRIES
========================================================= */

function renderCountries(list){

    countryList.innerHTML = "";


    if(list.length === 0){

        countryList.innerHTML = `

            <div class="no-results">

                <i class="fa-solid fa-earth-americas"></i>

                No country found

            </div>

        `;

        return;

    }


    list.forEach(
        function(country){

            const item =
                document.createElement("button");


            item.type = "button";

            item.className =
                "country-item";


            item.innerHTML = `

                <span class="country-flag">
                    ${country[0]}
                </span>

                <span class="country-name">
                    ${country[1]}
                </span>

                <span class="country-code">
                    ${country[2]}
                </span>

            `;


            item.addEventListener(
                "click",
                function(){

                    selectCountry(
                        country
                    );

                }
            );


            countryList.appendChild(
                item
            );

        }
    );

}


/* =========================================================
   SELECT COUNTRY
========================================================= */

function selectCountry(country){

    currentCountry = {

        flag:country[0],

        name:country[1],

        code:country[2]

    };


    selectedFlag.textContent =
        country[0];


    selectedCode.textContent =
        country[2];


    closeCountryModal();


    phoneNumber.focus();

}


/* =========================================================
   COUNTRY SEARCH
========================================================= */

countrySearch.addEventListener(
    "input",
    function(){

        const query =
            this.value
            .toLowerCase()
            .trim();


        const filtered =
            countries.filter(
                function(country){

                    return (

                        country[1]
                        .toLowerCase()
                        .includes(query)

                        ||

                        country[2]
                        .includes(query)

                    );

                }
            );


        renderCountries(
            filtered
        );

    }
);


/* =========================================================
   PHONE INPUT
========================================================= */

phoneNumber.addEventListener(
    "input",
    function(){

        this.value =
            this.value.replace(
                /\D/g,
                ""
            );


        errorMessage.textContent =
            "";


        phoneBox.classList.remove(
            "invalid"
        );

    }
);


/* =========================================================
   FORM SUBMIT
========================================================= */

registerForm.addEventListener(
    "submit",
    function(event){

        event.preventDefault();


        const number =
            phoneNumber.value.trim();


        /* EMPTY */

        if(!number){

            showError(
                "Please enter your phone number."
            );

            return;

        }


        /* LENGTH */

        if(
            number.length < 7 ||
            number.length > 15
        ){

            showError(
                "Please enter a valid phone number."
            );

            return;

        }


        /* FULL PHONE */

        const fullPhone =
            currentCountry.code +
            number;


        console.log(
            "CHAPCY PHONE:",
            fullPhone
        );


        /* LOADING */

        nextButton.classList.add(
            "loading"
        );


        /*
        ==============================================
        NEXT STEP:

        Firebase Phone Authentication

        Here we will connect:

        signInWithPhoneNumber()

        and send OTP.

        ==============================================
        */


        setTimeout(
            function(){

                nextButton.classList.remove(
                    "loading"
                );


                alert(
                    "CHAPCY will send OTP to:\n\n"
                    + fullPhone
                );


            },
            900
        );

    }
);


/* =========================================================
   SHOW ERROR
========================================================= */

function showError(message){

    errorMessage.textContent =
        message;


    phoneBox.classList.add(
        "invalid"
    );


    phoneNumber.focus();

}


/* =========================================================
   PHONE FOCUS
========================================================= */

phoneNumber.addEventListener(
    "focus",
    function(){

        errorMessage.textContent = "";

    }
);
