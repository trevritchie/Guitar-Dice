class GuitarDice {
    constructor() {
        this.chordTypes = ["Major 6", "Minor 6", "Dominant 7", "Dominant 7 b5"];
        this.chordTones6 = ["Root", "Third", "Fifth", "Sixth"];
        this.chordTones7 = ["Root", "Third", "Fifth", "Seventh"];
        this.voicings = ["Unison", "Third", "Triad", "Shell", "Octave", "Drop 2", "Drop 3", "Drop 2 and 4", "Double Octave"];
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    roll() {
        const string = this.randomInt(1, 6);
        let fret = this.randomInt(0, 12);
        const chordType = this.chordTypes[this.randomInt(0, this.chordTypes.length - 1)];
        const voicing = this.voicings[this.randomInt(0, this.voicings.length - 1)];
        
        // Handle double octave voicing string restrictions
        if (voicing === "Double Octave") {
            if (string === 5) return { ...this.roll(), string: 6 };
            if (string === 2) return { ...this.roll(), string: 1 };
        }

        // Handle physical possibilities for certain voicings
        if (fret < 4 && ["Third", "Triad", "Shell", "Octave"].includes(voicing)) {
            fret += 4;
        }

        const chordTones = chordType.includes("6") ? this.chordTones6 : this.chordTones7;
        const chordTone = chordTones[this.randomInt(0, chordTones.length - 1)];

        return {
            string,
            fret,
            chordTone,
            chordType,
            voicing
        };
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    const guitarDice = new GuitarDice();
    const modal = document.getElementById('helpModal');
    const closeBtn = document.getElementsByClassName('close')[0];

    function constructSentence(exercise) {
        const firstLine = exercise.fret === 0 
            ? `Play the open ${exercise.string}${getOrdinalSuffix(exercise.string)} string.`
            : `Play the ${exercise.fret}${getOrdinalSuffix(exercise.fret)} fret on the ${exercise.string}${getOrdinalSuffix(exercise.string)} string.`;
        const secondLine = `Make this note the ${exercise.chordTone} of a ${exercise.chordType} chord`;
        const thirdLine = `in a ${exercise.voicing} voicing.`;
        
        return `${firstLine}\n${secondLine}\n${thirdLine}`;
    }

    function getOrdinalSuffix(number) {
        const j = number % 10,
              k = number % 100;
        if (j == 1 && k != 11) {
            return "st";
        }
        if (j == 2 && k != 12) {
            return "nd";
        }
        if (j == 3 && k != 13) {
            return "rd";
        }
        return "th";
    }

    function updateDisplay(exercise) {
        // Update the table values
        Object.keys(exercise).forEach(key => {
            const element = document.getElementById(key);
            element.textContent = exercise[key];
            
            // Add highlight animation
            element.classList.remove('highlight');
            void element.offsetWidth; // Trigger reflow
            element.classList.add('highlight');
        });

        // Update the sentence
        const sentenceElement = document.getElementById('sentenceDisplay');
        const [firstLine, secondLine, thirdLine] = constructSentence(exercise).split('\n');
        sentenceElement.innerHTML = `${firstLine}<br>${secondLine}<br>${thirdLine}`;
        
        // Add highlight animation to sentence
        sentenceElement.classList.remove('highlight');
        void sentenceElement.offsetWidth; // Trigger reflow
        sentenceElement.classList.add('highlight');
    }

    // Roll button click handler
    document.getElementById('rollButton').addEventListener('click', () => {
        updateDisplay(guitarDice.roll());
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            updateDisplay(guitarDice.roll());
        } else if (e.code === 'Escape') {
            // Toggle the modal visibility
            modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
        }
    });

    // Modal controls
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };
}); 