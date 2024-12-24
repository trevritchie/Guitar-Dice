// Main class that handles the guitar exercise logic
class GuitarDice {
    constructor() {
        // Initialize arrays of possible values for each parameter
        this.chordTypes = ["Major 6", "Minor 6", "Dominant 7", "Dominant 7 b5"];
        this.chordTones6 = ["Root", "Third", "Fifth", "Sixth"];  // Chord tones for 6th chords
        this.chordTones7 = ["Root", "Third", "Fifth", "Seventh"];  // Chord tones for 7th chords
        this.voicings = ["Unison", "Third", "Triad", "Shell", "Octave", "Drop 2", "Drop 3", "Drop 2 and 4", "Double Octave"];
    }

    // Helper function to generate random integer between min and max (inclusive)
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Main function to generate a random exercise
    roll() {
        const string = this.randomInt(1, 6);
        let fret = this.randomInt(0, 12);
        const chordType = this.chordTypes[this.randomInt(0, this.chordTypes.length - 1)];
        const voicing = this.voicings[this.randomInt(0, this.voicings.length - 1)];
        
        // Handle physical limitations for double octave voicings
        // Double octaves aren't possible starting on strings 2 or 5
        if (voicing === "Double Octave") {
            if (string === 5) return { ...this.roll(), string: 6 };
            if (string === 2) return { ...this.roll(), string: 1 };
        }

        // Adjust fret position for certain voicings that need more room
        if (fret < 4 && ["Third", "Triad", "Shell", "Octave"].includes(voicing)) {
            fret += 4;
        }

        // Select appropriate chord tones based on chord type (6th or 7th)
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

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const guitarDice = new GuitarDice();
    const modal = document.getElementById('helpModal');
    const closeBtn = document.getElementsByClassName('close')[0];
    const helpButton = document.getElementById('helpButton');

    // Function to construct the exercise sentence with different formats for desktop/mobile
    function constructSentence(exercise) {
        const stringWithSuffix = exercise.string + getOrdinalSuffix(exercise.string);
        
        // Create the first line based on whether it's an open string
        const firstLine = exercise.fret === 0 
            ? `Play the open ${stringWithSuffix} string`
            : `Play the ${exercise.fret}${getOrdinalSuffix(exercise.fret)} fret on the ${stringWithSuffix} string`;
        
        // Use "an" only for "Octave" voicing, "a" for everything else
        const article = exercise.voicing === "Octave" ? 'an' : 'a';
        
        // Desktop format
        const desktopFormat = `${firstLine}.\n` +
                             `Make this note the ${exercise.chordTone} of a ${exercise.chordType} chord\n` +
                             `in ${article} ${exercise.voicing} voicing.`;
        
        // Mobile format
        const mobileFormat = `${firstLine}.\n` +
                            `Make this note the ${exercise.chordTone}\n` +
                            `of a ${exercise.chordType} chord\n` +
                            `in ${article} ${exercise.voicing} voicing.`;
        
        return { desktopFormat, mobileFormat };
    }

    // Helper function to add appropriate ordinal suffix (1st, 2nd, 3rd, etc.)
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

    // Function to update all display elements with new exercise values
    function updateDisplay(exercise) {
        // Update the table values with highlight animation
        Object.keys(exercise).forEach(key => {
            const element = document.getElementById(key);
            element.textContent = exercise[key];
            
            // Add highlight animation by removing and re-adding class
            element.classList.remove('highlight');
            void element.offsetWidth; // Trigger reflow to restart animation
            element.classList.add('highlight');
        });

        // Update the sentence with appropriate format for device type
        const sentenceElement = document.getElementById('sentenceDisplay');
        const sentences = constructSentence(exercise);
        sentenceElement.setAttribute('data-desktop', sentences.desktopFormat);
        sentenceElement.setAttribute('data-mobile', sentences.mobileFormat);
        
        // Add highlight animation to sentence
        sentenceElement.classList.remove('highlight');
        void sentenceElement.offsetWidth; // Trigger reflow
        sentenceElement.classList.add('highlight');
    }

    // Event handler for roll button clicks
    document.getElementById('rollButton').addEventListener('click', () => {
        updateDisplay(guitarDice.roll());
    });

    // Keyboard event handlers
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault(); // Prevent page scroll
            updateDisplay(guitarDice.roll());
        } else if (e.code === 'Escape') {
            // Toggle help modal visibility
            modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
        }
    });

    // Modal close handlers
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };

    // Event handler for help button clicks
    helpButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });
}); 