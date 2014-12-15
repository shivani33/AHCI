//
// guitarConstants.js
//

// Coordinates of the strings in the fretboard image
var stringCoords = [10, 30, 50, 70, 90, 110 ];
var nstrings = stringCoords.length;

// Coordinates of the frets in the fretboard image
var fretCoords = [60, 160, 260, 360, 450, 545, 635, 725, 815, 900, 980, 1060, 1140, 1220, 1290, 1365, 1435, 1500, 1570, 1640, 1700, 1765, 1820 ];
var nfrets = fretCoords.length;

// Mapping of all the notes of the fret.
var notesMap = [
	["F","Gb","G","Ab","A","Bb","B","C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B","C","Db","D","Eb","E"],
	["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B","C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"],
	["Ab","A","Bb","B","C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B","C","Db","D","Eb","E","F","Gb","G"],
	["Eb","E","F","Gb","G","Ab","A","Bb","B","C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B","C","Db","D"],
	["Bb","B","C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B","C","Db","D","Eb","E","F","Gb","G","Ab","A"],
	["F","Gb","G","Ab","A","Bb","B","C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B","C","Db","D","Eb","E"]
];